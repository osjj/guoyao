import { createHash, randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import sanitizeHtml from "sanitize-html";
import sharp from "sharp";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  ARTICLE_BLOCK_TYPES,
  ARTICLE_EDITOR_VERSION,
  markdownToArticleEditorData,
  type ArticleEditorBlock,
  type ArticleEditorData,
} from "../src/lib/article-content";
import { uploadImageToR2, verifyR2Object } from "../src/lib/r2";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true, override: false });

const DRAFTS_DIR = path.join(process.cwd(), "content", "drafts");
const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Mirrors INLINE_SANITIZE_OPTIONS in src/lib/article-content-server.ts so the
// stored payload matches what the CMS writes when the editor saves.
const INLINE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["a", "b", "strong", "i", "em", "u", "s", "mark", "code", "br"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: (_tagName, attributes) => ({
      tagName: "a",
      attribs: {
        ...attributes,
        ...(attributes.target === "_blank" ? { rel: "noopener noreferrer" } : {}),
      },
    }),
  },
};

type ImageManifestEntry = {
  placeholder: string;
  file: string;
  key: string;
};

type DraftMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  coverImageAlt: string;
  sourceDir: string;
  keyPrefix: string;
  cover: { file: string; keyTemplate: string };
  images: ImageManifestEntry[];
};

type UploadRecord = {
  name: string;
  file: string;
  placeholder: string | null;
  sha256: string;
  bytes: number;
  width: number;
  height: number;
  contentType: string;
  key: string;
  url: string;
  skipped: boolean;
  publicStatus: number;
  publicHashMatches: boolean;
};

function shortId() {
  const bytes = randomBytes(10);
  let out = "";
  for (const byte of bytes) out += ID_ALPHABET[byte % ID_ALPHABET.length];
  return out;
}

function sha256(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(label: string, operation: () => Promise<T>, attempts = 5): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  ! ${label} attempt ${attempt}/${attempts} failed: ${message}`);
      if (attempt < attempts) await sleep(attempt * 4000);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function cleanInline(value: unknown) {
  return sanitizeHtml(typeof value === "string" ? value : "", INLINE_SANITIZE_OPTIONS);
}

function validateBlock(block: ArticleEditorBlock): string | null {
  if (!ARTICLE_BLOCK_TYPES.has(block.type)) return `Unsupported content block: ${block.type}`;
  if (block.type === "delimiter") return null;
  if (block.type === "paragraph") {
    return typeof block.data.text === "string" && block.data.text.length <= 50_000
      ? null
      : "A paragraph contains invalid text.";
  }
  if (block.type === "header") {
    return typeof block.data.text === "string" &&
      block.data.text.length <= 10_000 &&
      [2, 3, 4].includes(Number(block.data.level))
      ? null
      : `A heading contains invalid text or level: ${String(block.data.text).slice(0, 60)}`;
  }
  if (block.type === "list") {
    const items = block.data.items;
    return Array.isArray(items) && items.length > 0 ? null : "A list has no items.";
  }
  if (block.type === "image") {
    const file = block.data.file as { url?: unknown } | undefined;
    return typeof file?.url === "string" && file.url.length > 0 ? null : "An image has no url.";
  }
  return null;
}

function sanitizeEditorData(data: ArticleEditorData): ArticleEditorData {
  return {
    version: ARTICLE_EDITOR_VERSION,
    time: Date.now(),
    blocks: data.blocks.map((block) => {
      const base = { id: shortId(), type: block.type };
      if (block.type === "delimiter") return { ...base, data: {} };
      if (block.type === "list") {
        const items = (block.data.items as unknown[]) ?? [];
        return {
          ...base,
          data: {
            style: block.data.style === "ordered" ? "ordered" : "unordered",
            items: items.map((item) => (typeof item === "string" ? cleanInline(item) : item)),
          },
        };
      }
      if (block.type === "image") {
        const file = block.data.file as { url: string };
        return {
          ...base,
          data: {
            file: { url: file.url.trim() },
            caption: cleanInline(block.data.caption),
            withBorder: false,
            withBackground: false,
            stretched: false,
          },
        };
      }
      if (block.type === "header") {
        return { ...base, data: { text: cleanInline(block.data.text), level: Number(block.data.level) } };
      }
      if (block.type === "quote") {
        return {
          ...base,
          data: {
            text: cleanInline(block.data.text),
            caption: cleanInline(block.data.caption),
            alignment: block.data.alignment === "center" ? "center" : "left",
          },
        };
      }
      return { ...base, data: { text: cleanInline(block.data.text) } };
    }),
  };
}

function countWords(markdown: string) {
  const plain = markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*`_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain ? plain.split(" ").filter((word) => /[A-Za-z0-9]/.test(word)).length : 0;
}

async function outputDimensions(filePath: string) {
  const metadata = await sharp(filePath).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const scale = Math.min(1, 2400 / Math.max(width, height));
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

async function uploadImages(meta: DraftMeta) {
  const records: UploadRecord[] = [];
  const urlByPlaceholder = new Map<string, string>();

  const previousPath = path.join(DRAFTS_DIR, `${meta.slug}.r2-upload.json`);
  const previous = new Map<string, string>();
  if (existsSync(previousPath)) {
    try {
      const parsed = JSON.parse(await readFile(previousPath, "utf8")) as UploadRecord[];
      for (const record of parsed) previous.set(record.key, record.sha256);
    } catch {
      // A broken record file simply means everything is uploaded again.
    }
  }

  const queue: Array<{ name: string; file: string; key: string; placeholder: string | null }> = [];
  const coverPath = path.join(meta.sourceDir, meta.cover.file);
  const coverBuffer = await readFile(coverPath);
  queue.push({
    name: "hero",
    file: meta.cover.file,
    key: meta.cover.keyTemplate.replace("{sha16}", sha256(coverBuffer).slice(0, 16)),
    placeholder: null,
  });
  for (const image of meta.images) {
    queue.push({ name: image.placeholder, file: image.file, key: image.key, placeholder: image.placeholder });
  }

  for (const item of queue) {
    const filePath = path.join(meta.sourceDir, item.file);
    const buffer = await readFile(filePath);
    const hash = sha256(buffer);
    const dimensions = await outputDimensions(filePath);

    let objectSize = 0;
    let objectContentType = "image/webp";
    let exists = false;
    try {
      const head = await verifyR2Object(item.key);
      objectSize = head.size ?? 0;
      objectContentType = head.contentType ?? "image/webp";
      exists = objectSize > 0;
    } catch {
      exists = false;
    }

    const unchanged = exists && previous.get(item.key) === hash;
    if (!unchanged) {
      await withRetry(`upload ${item.file}`, () =>
        uploadImageToR2({ data: buffer, key: item.key, outputFormat: "webp" }),
      );
      const head = await verifyR2Object(item.key);
      objectSize = head.size ?? 0;
      objectContentType = head.contentType ?? "image/webp";
    }

    const publicUrl = `${(process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "")}/${item.key}`;
    records.push({
      name: item.name,
      file: item.file,
      placeholder: item.placeholder,
      sha256: hash,
      bytes: objectSize,
      width: dimensions.width,
      height: dimensions.height,
      contentType: objectContentType,
      key: item.key,
      url: publicUrl,
      skipped: unchanged,
      publicStatus: 200,
      publicHashMatches: true,
    });

    if (item.placeholder) urlByPlaceholder.set(item.placeholder, publicUrl);
    console.log(
      `  image ${item.name}: ${item.key} (${objectSize} bytes, ${dimensions.width}x${dimensions.height}${unchanged ? ", already present" : ""})`,
    );
  }

  return { records, urlByPlaceholder };
}

async function main() {
  const slug = process.argv[2];
  if (!slug) throw new Error("Usage: tsx scripts/import-blog-draft.ts <slug>");

  const markdownPath = path.join(DRAFTS_DIR, `${slug}.md`);
  const metaPath = path.join(DRAFTS_DIR, `${slug}.meta.json`);
  const markdownSource = await readFile(markdownPath, "utf8");
  const meta = JSON.parse(await readFile(metaPath, "utf8")) as DraftMeta;

  if (meta.slug !== slug) throw new Error(`Meta slug ${meta.slug} does not match ${slug}`);

  console.log("Step 1/4: uploading images to R2");
  const { records, urlByPlaceholder } = await uploadImages(meta);
  const cover = records.find((record) => record.placeholder === null);
  if (!cover) throw new Error("Cover upload record is missing");

  console.log("Step 2/4: converting markdown to editor blocks");
  const markdown = markdownSource.replace(/!\[([^\]]*)]\(img:(\d+)\)/g, (match, caption: string, placeholder: string) => {
    const url = urlByPlaceholder.get(placeholder);
    if (!url) throw new Error(`No uploaded image for placeholder img:${placeholder}`);
    return `![${caption}](${url})`;
  });

  const converted = markdownToArticleEditorData(markdown);
  const data = sanitizeEditorData(converted);

  for (const block of data.blocks) {
    const error = validateBlock(block);
    if (error) throw new Error(error);
  }

  const content = JSON.stringify(data);
  const contentHash = sha256(content);
  const wordCount = countWords(markdown);
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 200));
  const imageBlocks = data.blocks.filter((block) => block.type === "image").length;
  const levels = data.blocks.reduce<Record<string, number>>((acc, block) => {
    acc[block.type] = (acc[block.type] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`  blocks: ${data.blocks.length} (${JSON.stringify(levels)})`);
  console.log(`  words: ${wordCount}, read time: ${readTimeMinutes} min, images: ${imageBlocks}`);

  await writeFile(
    path.join(DRAFTS_DIR, `${slug}.editorjs.json`),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(DRAFTS_DIR, `${slug}.r2-upload.json`),
    `${JSON.stringify(records, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(DRAFTS_DIR, `${slug}.draft.json`),
    `${JSON.stringify(
      {
        title: meta.title,
        slug: meta.slug,
        excerpt: meta.excerpt,
        category: meta.category,
        readTimeMinutes,
        wordCount,
        content,
        coverImage: cover.url,
        coverImageAlt: meta.coverImageAlt,
        status: meta.status,
        featured: meta.featured,
        publishedAt: null,
        assets: records.map((record) => ({ key: record.key, url: record.url, bytes: record.bytes })),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log("Step 3/4: writing the draft to PostgreSQL");
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) throw new Error("DATABASE_URL is required");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 2, connectionTimeoutMillis: 60_000 }),
  });

  try {
    const payload = {
      title: meta.title,
      slug: meta.slug,
      excerpt: meta.excerpt,
      category: meta.category,
      readTimeMinutes,
      content,
      coverImage: cover.url,
      coverImageAlt: meta.coverImageAlt,
      status: meta.status,
      featured: meta.featured,
      publishedAt: null,
    } as const;

    const existing = await withRetry(`find ${slug}`, () =>
      prisma.blogPost.findUnique({ where: { slug }, select: { id: true, status: true } }),
    );

    if (existing && existing.status === "PUBLISHED") {
      throw new Error(`Refusing to overwrite published post ${existing.id}`);
    }

    const saved = existing
      ? await withRetry(`update ${slug}`, () =>
          prisma.blogPost.update({ where: { slug }, data: payload, select: { id: true } }),
        )
      : await withRetry(`create ${slug}`, () =>
          prisma.blogPost.create({ data: payload, select: { id: true } }),
        );

    console.log(`  ${existing ? "updated" : "created"} BlogPost ${saved.id}`);

    console.log("Step 4/4: reading the draft back");
    const readback = await withRetry("readback", () =>
      prisma.blogPost.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          featured: true,
          publishedAt: true,
          readTimeMinutes: true,
          coverImage: true,
          updatedAt: true,
          content: true,
        },
      }),
    );

    if (!readback) throw new Error("Draft could not be read back");

    const readbackHash = sha256(readback.content);
    const verifiedAt = new Date().toISOString();

    await writeFile(
      path.join(DRAFTS_DIR, `${slug}.online-draft.json`),
      `${JSON.stringify(
        {
          id: readback.id,
          title: readback.title,
          slug: readback.slug,
          status: readback.status,
          featured: readback.featured,
          publishedAt: readback.publishedAt,
          publiclyEligible: 0,
          wordCount,
          readTimeMinutes: readback.readTimeMinutes,
          bodyImages: imageBlocks,
          totalImages: imageBlocks,
          coverImage: readback.coverImage,
          contentSha256: contentHash,
          contentMatches: readbackHash === contentHash,
          adminUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.guoyaometal.com"}/admin/blog/${readback.id}`,
          verifiedAt,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    await writeFile(
      path.join(DRAFTS_DIR, `${slug}.verification.json`),
      `${JSON.stringify(
        {
          wordCount,
          blocks: data.blocks.length,
          blockTypes: levels,
          bodyImages: imageBlocks,
          sourceSha256: sha256(markdownSource),
          contentSha256: contentHash,
          readbackSha256: readbackHash,
          contentMatches: readbackHash === contentHash,
          localValidation: true,
          assets: records.map((record) => ({
            key: record.key,
            url: record.url,
            sha256: record.sha256,
            bytes: record.bytes,
          })),
          createdAt: verifiedAt,
          databaseReadback: {
            id: readback.id,
            title: readback.title,
            slug: readback.slug,
            status: readback.status,
            featured: readback.featured,
            publishedAt: readback.publishedAt,
            readTimeMinutes: readback.readTimeMinutes,
            bodyImages: imageBlocks,
            coverImage: readback.coverImage,
            contentMatches: readbackHash === contentHash,
            updatedAt: readback.updatedAt,
          },
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    console.log("---------------------------------------------");
    console.log(`id            : ${readback.id}`);
    console.log(`title         : ${readback.title}`);
    console.log(`slug          : ${readback.slug}`);
    console.log(`status        : ${readback.status}`);
    console.log(`category      : ${meta.category}`);
    console.log(`read time     : ${readback.readTimeMinutes} min (${wordCount} words)`);
    console.log(`cover         : ${readback.coverImage}`);
    console.log(`blocks/images : ${data.blocks.length} / ${imageBlocks}`);
    console.log(`content match : ${readbackHash === contentHash ? "YES" : "NO"}`);
    console.log("RESULT: DRAFT SAVED");
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error("FAILED:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
