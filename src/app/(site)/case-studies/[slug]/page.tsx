import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getPublishedCaseStudy } from "@/lib/public-case-studies";
import { SITE_NAME } from "@/lib/site-identity";
import { loadEditorialContent } from "@/components/site/metal-editorial";
import { getSiteUrl } from "@/lib/site-url";
import { getEditorialSeo } from "@/lib/editorial-seo";
import { MetalCaseStudyArticle } from "@/components/site/metal-case-study-article";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
const getStudy = cache((slug: string) => loadEditorialContent(getPublishedCaseStudy(slug)));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getStudy((await params).slug);
  if (!study) notFound();
  const seo = getEditorialSeo("case-studies", study);
  return {
    title: seo.title, description: seo.description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    authors: [{ name: SITE_NAME, url: `${getSiteUrl()}/` }],
    openGraph: {
      title: seo.title, description: seo.description, type: "article", siteName: SITE_NAME,
      url: `/case-studies/${study.slug}`, modifiedTime: study.updatedAt,
      authors: [`${getSiteUrl()}/`],
      ...(study.coverImage ? { images: [{ url: study.coverImage, alt: study.coverImageAlt || study.title }] } : {}),
    },
    twitter: {
      card: study.coverImage ? "summary_large_image" : "summary",
      title: seo.title, description: seo.description,
      ...(study.coverImage ? { images: [{ url: study.coverImage, alt: study.coverImageAlt || study.title }] } : {}),
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const study = await getStudy((await params).slug);
  if (!study) notFound();

  return <MetalCaseStudyArticle study={study} />;
}
