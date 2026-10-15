import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedCaseStudy } from "@/lib/public-case-studies";
import { SITE_NAME } from "@/lib/site-identity";
import { DetailUnavailable, loadEditorialContent } from "@/components/site/metal-editorial";
import { MetalCaseStudyArticle } from "@/components/site/metal-case-study-article";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await loadEditorialContent(getPublishedCaseStudy((await params).slug));
  if (!result.available) return { title: "Project temporarily unavailable", robots: { index: false } };
  const study = result.data;
  if (!study) return { title: "Case study not found", robots: { index: false } };
  return {
    title: study.title, description: study.excerpt,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      title: study.title, description: study.excerpt, type: "article", siteName: SITE_NAME,
      url: `/case-studies/${study.slug}`, modifiedTime: study.updatedAt,
      ...(study.coverImage ? { images: [{ url: study.coverImage, alt: study.coverImageAlt ?? study.title }] } : {}),
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const result = await loadEditorialContent(getPublishedCaseStudy((await params).slug));
  if (!result.available) return <DetailUnavailable type="project" />;
  const study = result.data;
  if (!study) notFound();

  return <MetalCaseStudyArticle study={study} />;
}
