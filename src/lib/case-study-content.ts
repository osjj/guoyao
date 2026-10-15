import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
export const caseImageUrl = z.string().trim().max(2000).refine(value =>
  /^https?:\/\//i.test(value) || (value.startsWith("/") && !value.startsWith("//")), "Use an http(s) URL or a site path.");
function parseCaseMediaUrl(value: string): URL | null {
  // Reject characters that URL parsers may silently normalize into another URL.
  if (/[\u0000-\u001f\u007f\\]/.test(value) || /%(?:0[0-9a-f]|1[0-9a-f]|7f|5c)/i.test(value)) return null;
  const normalized = value.trim();
  if (/\s/.test(normalized)) return null;
  const isSitePath = normalized.startsWith("/") && !normalized.startsWith("//");
  if (!isSitePath && !/^https?:\/\/[^/]/i.test(normalized)) return null;
  try {
    const url = new URL(normalized, "https://case-media.invalid");
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}

export const caseVideoUrl = z.string().max(2000).refine(value => {
  const url = parseCaseMediaUrl(value);
  return url !== null && /\.(?:mp4|webm)$/i.test(url.pathname);
}, "Use a direct MP4 or WebM http(s) URL or site path.").transform(value => value.trim());
export const caseVideoPosterUrl = z.string().max(2000).refine(value => parseCaseMediaUrl(value) !== null,
  "Use an http(s) image URL or site path.").transform(value => value.trim());
const video = z.object({
  url: caseVideoUrl,
  title: text(240),
  caption: z.string().trim().max(1000),
  poster: caseVideoPosterUrl.optional(),
});
export type CaseStudyVideo = z.infer<typeof video>;

export function getCaseVideoSectionId(sections: ReadonlyArray<{ id: string }>): string {
  const occupiedIds = new Set(sections.map(section => section.id));
  let id = "project-video";
  let suffix = 2;
  while (occupiedIds.has(id)) id = `project-video-${suffix++}`;
  return id;
}

export const MAX_CASE_SECTION_IMAGES = 100;
const image = z.object({ url: caseImageUrl, alt: text(200), caption: z.string().trim().max(500) });
export type CaseStudyImage = z.infer<typeof image>;

// Keep the legacy image first when both representations occur in imported content.
export function getCaseSectionImages(section: { image?: CaseStudyImage; images?: CaseStudyImage[] }): CaseStudyImage[] {
  return [...(section.image ? [section.image] : []), ...(section.images ?? [])];
}
export const caseStudyContentSchema = z.object({
  introduction: text(3000),
  stats: z.array(z.object({ value: text(80), label: text(120) })).max(8),
  video: video.optional(),
  sections: z.array(z.object({
    id: text(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).refine(value => value !== "your-project", "This section ID is reserved."),
    title: text(240), navLabel: text(80),
    paragraphs: z.array(text(12000)).min(1).max(30),
    image: image.optional(),
    images: z.array(image).max(MAX_CASE_SECTION_IMAGES).optional(),
    points: z.array(z.object({ title: text(240), text: text(5000) })).max(30).optional(),
    table: z.object({ caption: text(300), headings: z.array(text(200)).min(1).max(8), rows: z.array(z.array(z.string().max(2000)).min(1).max(8)).min(1).max(50) })
      .refine(table => table.rows.every(row => row.length === table.headings.length), "All table rows must match the heading count.").optional(),
  }).refine(section => getCaseSectionImages(section).length <= MAX_CASE_SECTION_IMAGES,
    `A chapter can contain up to ${MAX_CASE_SECTION_IMAGES} images.`)).min(1).max(20),
  conclusion: text(5000),
  relatedLinks: z.array(z.object({ href: caseImageUrl, label: text(150) })).max(12),
}).refine(value => new Set(value.sections.map(section => section.id)).size === value.sections.length, "Section IDs must be unique.");

export type CaseStudyContent = z.infer<typeof caseStudyContentSchema>;
export type CaseFormState = { error?: string };
export type AdminCaseStudy = {
  id: string; title: string; slug: string; excerpt: string; category: string;
  content: CaseStudyContent; coverImage: string | null; coverImageAlt: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; publishedDate: string; updatedAt: string;
};

export function isCasePublished(study: { status: string; publishedAt: Date | null }, now = new Date()) {
  return study.status === "PUBLISHED" && study.publishedAt !== null && study.publishedAt <= now;
}
