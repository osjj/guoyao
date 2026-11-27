import type { Metadata } from "next";
import { getPublishedBlogPostSummaries } from "@/lib/public-blog";
import { loadEditorialContent } from "@/components/site/metal-editorial";
import { BlogArchive, type BlogArchiveArticle } from "@/components/site/blog-archive";
import { SITE_NAME } from "@/lib/site-identity";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Architectural Metal & Finishes Blog",
  description:
    "Perspectives on architectural metal, surface finishes and the details that shape a space. Read the Guoyao Metal journal.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Architectural Metal & Finishes Blog",
    type: "website",
    url: "/blog",
    siteName: SITE_NAME,
    description:
      "Perspectives on architectural metal, surface finishes and the details that shape a space. Read the Guoyao Metal journal.",
    images: [
      {
        url: "/images/home-projects/extra/entrance-joint-detail.webp",
        alt: "Connection detail of a curved architectural metal entrance framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Architectural Metal & Finishes Blog",
    description:
      "Perspectives on architectural metal, surface finishes and the details that shape a space. Read the Guoyao Metal journal.",
    images: [
      {
        url: "/images/home-projects/extra/entrance-joint-detail.webp",
        alt: "Connection detail of a curved architectural metal entrance framework",
      },
    ],
  },
};

export default async function BlogPage() {
  const summaries = await loadEditorialContent(getPublishedBlogPostSummaries());
  const articles: BlogArchiveArticle[] = summaries.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    coverImageFit: post.coverImageFit,
    featured: post.featured,
    publishedAt: post.publishedAt,
    publishedLabel: post.publishedLabel,
  }));

  return <BlogArchive articles={articles} />;
}
