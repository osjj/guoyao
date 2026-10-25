import "server-only";

import { cache } from "react";
import type { BlogPost } from "@/generated/prisma/client";

const DEFAULT_COVER_IMAGE = "/images/metal/material-study.webp";

type PublishedBlogPostRecord = BlogPost | null;

export type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  readTimeMinutes: number;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  coverImageFit?: "contain" | "cover";
  featured: boolean;
  publishedAt: string;
  publishedLabel: string;
  updatedAt: Date;
};

export type PublicBlogPostSummary = Omit<PublicBlogPost, "content">;

const blogSummarySelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  category: true,
  readTimeMinutes: true,
  coverImage: true,
  coverImageAlt: true,
  featured: true,
  publishedAt: true,
  updatedAt: true,
} as const;

type BlogSummaryRecord = Pick<BlogPost, keyof typeof blogSummarySelect>;

function serializeBlogPostSummary(post: BlogSummaryRecord): PublicBlogPostSummary {
  const publishedAt = post.publishedAt ?? post.updatedAt;

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    readTime: `${post.readTimeMinutes} min read`,
    readTimeMinutes: post.readTimeMinutes,
    coverImage: post.coverImage || DEFAULT_COVER_IMAGE,
    coverImageAlt: post.coverImage ? post.coverImageAlt || post.title : "Illustrative material study",
    featured: post.featured,
    publishedAt: publishedAt.toISOString(),
    publishedLabel: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(publishedAt),
    updatedAt: post.updatedAt,
  };
}

function serializeBlogPost(post: NonNullable<PublishedBlogPostRecord>): PublicBlogPost {
  return { ...serializeBlogPostSummary(post), content: post.content };
}

export const getPublishedBlogPostSummaries = cache(async (): Promise<PublicBlogPostSummary[]> => {
  const { prisma } = await import("@/lib/prisma");
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
    select: blogSummarySelect,
  });

  return posts.map(serializeBlogPostSummary);
});

export const getPublishedBlogPosts = cache(async (): Promise<PublicBlogPost[]> => {
  const { prisma } = await import("@/lib/prisma");
  const now = new Date();
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: now } },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
  });

  return posts.map(serializeBlogPost);
});

export const getPublishedBlogPostBySlug = cache(
  async (slug: string): Promise<PublicBlogPost | null> => {
    const { prisma } = await import("@/lib/prisma");
    const post = await prisma.blogPost.findFirst({
      where: { slug },
    });

    const now = new Date();
    if (post) return post.status === "PUBLISHED" && post.publishedAt && post.publishedAt <= now
      ? serializeBlogPost(post) : null;
    return null;
  },
);

export async function getPublishedBlogSitemapEntries() {
  return (await getPublishedBlogPosts()).map(({ slug, updatedAt }) => ({ slug, updatedAt }));
}
