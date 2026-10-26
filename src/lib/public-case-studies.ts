import "server-only";
import { cache } from "react";
import type { CustomerCaseStudy } from "@/data/shangri-la-case-study";
import { caseStudyContentSchema, isCasePublished } from "./case-study-content";
import type { CaseStudy as CaseRecord } from "@/generated/prisma/client";

export type PublicCaseStudySummary = Pick<CustomerCaseStudy,
  "slug" | "title" | "excerpt" | "category" | "coverImage" | "coverImageAlt"
>;

export const getPublishedCaseStudySummaries = cache(async (): Promise<PublicCaseStudySummary[]> => {
  const { prisma } = await import("@/lib/prisma");
  const records = await prisma.caseStudy.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      coverImage: true,
      coverImageAlt: true,
    },
  });
  return records.map(record => ({
    ...record,
    coverImage: record.coverImage ?? undefined,
    coverImageAlt: record.coverImageAlt ?? undefined,
  }));
});

export function serializeCaseStudy(record: CaseRecord): CustomerCaseStudy {
  const content = caseStudyContentSchema.parse(record.content);
  return {
    kind: "customer-project", slug: record.slug, title: record.title,
    excerpt: record.excerpt, category: record.category, updatedAt: record.updatedAt.toISOString(),
    ...content,
    coverImage: record.coverImage ?? undefined, coverImageAlt: record.coverImageAlt ?? undefined,
  };
}

export const getPublishedCaseStudies = cache(async (): Promise<CustomerCaseStudy[]> => {
  const { prisma } = await import("@/lib/prisma");
  const records = await prisma.caseStudy.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
  return records.map(serializeCaseStudy);
});

export async function getPublishedCaseStudySitemapEntries() {
  const { prisma } = await import("@/lib/prisma");
  return prisma.caseStudy.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    select: { slug: true, updatedAt: true, coverImage: true },
    orderBy: { slug: "asc" },
  });
}

export const getPublishedCaseStudy = cache(async (slug: string): Promise<CustomerCaseStudy | null> => {
  const { prisma } = await import("@/lib/prisma");
  const record = await prisma.caseStudy.findUnique({ where: { slug } });
  if (record) return isCasePublished(record) ? serializeCaseStudy(record) : null;
  return null;
});
