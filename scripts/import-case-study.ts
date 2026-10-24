/**
 * Import a case-study draft from content/case-drafts/<slug>.{meta,content}.json
 * into the remote CaseStudy table, uploading every image to R2 first.
 *
 * Idempotent: images already present in R2 are skipped, and an existing row with
 * the same slug is updated in place.
 *
 *   npx tsx scripts/import-case-study.ts murray-road-column-cladding
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true, override: false });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { uploadImageToR2, uploadVideoToR2, verifyR2Object } from "../src/lib/r2";
import { caseStudyContentSchema } from "../src/lib/case-study-content";

const DRAFTS_DIR = path.join(process.cwd(), "content", "case-drafts");
const slug = process.argv[2] ?? "murray-road-column-cladding";

type MetaImage = { file: string; key: string; url: string; alt?: string };
type MetaVideo = { file: string; key: string; url: string; mimeType?: string; bytes?: number };
type Meta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverImageAlt: string;
  sourceDir: string;
  cover: { file: string; key: string; url: string };
  images: MetaImage[];
  video?: MetaVideo;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 60_000,
  idleTimeoutMillis: 60_000,
});
const prisma = new PrismaClient({ adapter });

async function withRetry<T>(label: string, task: () => Promise<T>, attempts = 5): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`  ${label} attempt ${attempt}/${attempts} failed: ${message.slice(0, 160)}`);
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 2_000 * attempt));
    }
  }
  throw lastError;
}

async function main() {
  const meta = JSON.parse(await readFile(path.join(DRAFTS_DIR, `${slug}.meta.json`), "utf8")) as Meta;
  const content = JSON.parse(await readFile(path.join(DRAFTS_DIR, `${slug}.content.json`), "utf8"));

  console.log("Step 1/4: validating content against the case-study schema");
  const parsed = caseStudyContentSchema.parse(content);
  console.log(
    `  sections: ${parsed.sections.length} | stats: ${parsed.stats.length} | ` +
      `body images: ${parsed.sections.reduce((n, s) => n + (s.image ? 1 : 0) + (s.gallery?.length ?? 0), 0)} | ` +
      `videos: ${parsed.sections.filter((s) => s.video).length} | ` +
      `tables: ${parsed.sections.filter((s) => s.table).length}`,
  );

  console.log("Step 2/4: uploading images to R2");
  const uploads: Array<{ key: string; url: string; skipped: boolean }> = [];
  const jobs = [
    { kind: "cover", file: meta.cover.file, key: meta.cover.key, url: meta.cover.url },
    ...meta.images.map((image) => ({ kind: "image", file: image.file, key: image.key, url: image.url })),
  ];
  for (const job of jobs) {
    try {
      const existing = await withRetry(`verify ${job.key}`, () => verifyR2Object(job.key), 3);
      uploads.push({ key: job.key, url: existing.url, skipped: true });
      console.log(`  ${job.kind} ${path.basename(job.key)} — already in R2 (${existing.size} bytes)`);
      continue;
    } catch {
      // not present yet — upload below
    }
    const data = await readFile(path.join(meta.sourceDir, job.file));
    const uploaded = await withRetry(`upload ${job.key}`, () =>
      uploadImageToR2({ data, key: job.key, cacheControl: "public, max-age=31536000, immutable" }),
    );
    uploads.push({ key: uploaded.key, url: uploaded.url, skipped: false });
    console.log(`  ${job.kind} ${path.basename(uploaded.key)} — ${uploaded.width}x${uploaded.height} (${uploaded.size} bytes)`);
  }
  const coverUrl = uploads[0].url;

  let videoUpload: { key: string; url: string; skipped: boolean; size: number } | undefined;
  if (meta.video) {
    console.log("Step 2b/4: uploading the section video to R2");
    const video = meta.video;
    try {
      const existing = await withRetry(`verify ${video.key}`, () => verifyR2Object(video.key), 3);
      videoUpload = { key: existing.key, url: existing.url, skipped: true, size: existing.size ?? 0 };
      console.log(`  video ${path.basename(video.key)} — already in R2 (${existing.size ?? "?"} bytes)`);
    } catch {
      const data = await readFile(path.join(meta.sourceDir, video.file));
      const uploaded = await withRetry(`upload ${video.key}`, () =>
        uploadVideoToR2({ data, key: video.key, format: video.key.toLowerCase().endsWith(".webm") ? "webm" : "mp4" }),
      );
      videoUpload = { key: uploaded.key, url: uploaded.url, skipped: false, size: uploaded.size };
      console.log(`  video ${path.basename(uploaded.key)} — ${(uploaded.size / 1048576).toFixed(2)} MB (${uploaded.contentType})`);
    }
    const referenced = parsed.sections.some((section) => section.video?.url === videoUpload!.url);
    if (!referenced) console.warn(`  warning: ${video.key} is not referenced by any section video URL`);
  }

  console.log("Step 3/4: writing the case study to PostgreSQL");
  const data = {
    title: meta.title,
    slug: meta.slug,
    excerpt: meta.excerpt,
    category: meta.category,
    content: parsed,
    coverImage: coverUrl,
    coverImageAlt: meta.coverImageAlt,
    status: meta.status,
    publishedAt: null as Date | null,
  };
  const existing = await withRetry("find case study", () =>
    prisma.caseStudy.findUnique({ where: { slug: meta.slug }, select: { id: true } }),
  );
  const record = existing
    ? await withRetry("update case study", () => prisma.caseStudy.update({ where: { id: existing.id }, data }))
    : await withRetry("create case study", () => prisma.caseStudy.create({ data }));
  console.log(`  ${existing ? "updated" : "created"} ${record.id}`);

  console.log("Step 4/4: reading the case study back");
  const readback = await withRetry("read back", () =>
    prisma.caseStudy.findUnique({ where: { id: record.id } }),
  );
  if (!readback) throw new Error("The case study disappeared after writing");
  const readbackContent = caseStudyContentSchema.parse(readback.content);
  const contentMatches = JSON.stringify(readbackContent) === JSON.stringify(parsed);
  const imageUrls = new Set(uploads.map((upload) => upload.url));
  const brokenImages = [
    ...(readback.coverImage ? [readback.coverImage] : []),
    ...readbackContent.sections.flatMap((s) => [
      ...(s.image ? [s.image.url] : []),
      ...(s.gallery ?? []).map((shot) => shot.url),
    ]),
  ].filter((url) => !imageUrls.has(url));
  const knownVideoUrls = new Set(videoUpload ? [videoUpload.url] : []);
  const brokenVideos = readbackContent.sections
    .flatMap((section) => (section.video ? [section.video.url] : []))
    .filter((url) => !knownVideoUrls.has(url));

  console.log("---------------------------------------------");
  console.log("id            :", readback.id);
  console.log("title         :", readback.title);
  console.log("slug          :", readback.slug);
  console.log("status        :", readback.status);
  console.log("category      :", readback.category);
  console.log("sections      :", readbackContent.sections.length);
  console.log("cover         :", readback.coverImage);
  console.log("images        :", uploads.length, `(${uploads.filter((u) => u.skipped).length} reused, ${uploads.filter((u) => !u.skipped).length} new)`);
  console.log("video         :", videoUpload ? `${videoUpload.url} (${videoUpload.skipped ? "reused" : "new"}, ${(videoUpload.size / 1048576).toFixed(2)} MB)` : "none");
  console.log("unknown image :", brokenImages.length);
  console.log("unknown video :", brokenVideos.length);
  console.log("content match :", contentMatches ? "YES" : "NO");
  const ok = contentMatches && brokenImages.length === 0 && brokenVideos.length === 0;
  console.log("RESULT:", ok ? "CASE DRAFT SAVED" : "CHECK FAILED");
  if (!ok) process.exitCode = 1;

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error("IMPORT FAILED:", error);
  await prisma.$disconnect();
  process.exit(1);
});
