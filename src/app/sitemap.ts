import type { MetadataRoute } from "next";
import { getPublishedBlogSitemapEntries } from "@/lib/public-blog";
import { getSiteUrl } from "@/lib/site-url";
import { getPublishedCaseStudySitemapEntries } from "@/lib/public-case-studies";

export const dynamic = "force-dynamic";

function sitemapImages(value: string | null, baseUrl: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value, baseUrl);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password
      ? [url.href] : undefined;
  } catch {
    return undefined;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [articles, caseStudies] = await Promise.all([
    getPublishedBlogSitemapEntries(),
    getPublishedCaseStudySitemapEntries(),
  ]);

  return [
    {
      url: baseUrl,
      images: [`${baseUrl}/images/home-projects/extra/cartier-night.webp`],
    },
    { url: `${baseUrl}/blog` },
    { url: `${baseUrl}/case-studies` },
    ...caseStudies.map((study) => ({
      url: `${baseUrl}/case-studies/${study.slug}`,
      lastModified: study.updatedAt,
      images: sitemapImages(study.coverImage, baseUrl),
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      images: sitemapImages(article.coverImage, baseUrl),
    })),
    { url: `${baseUrl}/about`, images: ["https://media.guoyaometal.com/about/hero-factory.webp"] },
  ];
}
