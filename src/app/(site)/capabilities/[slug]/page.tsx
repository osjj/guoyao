import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CapabilityDetail } from "@/components/site/capability-detail";
import { loadEditorialContent } from "@/components/site/metal-editorial";
import { CAPABILITIES, CAPABILITIES_PATH, capabilityPath, getCapabilityBySlug } from "@/data/capabilities";
import { getPublishedCaseStudySummaries } from "@/lib/public-case-studies";
import { getPublishedBlogPostSummaries } from "@/lib/public-blog";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CAPABILITIES.map(({ slug }) => ({ slug }));
}

async function resolveCapability(params: Props["params"]) {
  const capability = getCapabilityBySlug((await params).slug);
  if (!capability) notFound();
  return capability;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const capability = await resolveCapability(params);
  return createPageMetadata({
    title: capability.seoTitle,
    description: capability.seoDescription,
    path: capabilityPath(capability.slug),
    image: { url: capability.heroImage.src, alt: capability.heroImage.alt },
  });
}

export default async function CapabilityPage({ params }: Props) {
  const capability = await resolveCapability(params);
  const [studies, posts] = await Promise.all([
    loadEditorialContent(getPublishedCaseStudySummaries()).catch(() => []),
    loadEditorialContent(getPublishedBlogPostSummaries()).catch(() => []),
  ]);
  const caseStudies = studies.filter(({ category }) => category === capability.categoryMatch);
  const postBySlug = new Map(posts.map((post) => [post.slug, post]));
  const articles = capability.relatedBlogSlugs.flatMap((slug) => {
    const post = postBySlug.get(slug);
    return post ? [post] : [];
  });
  const site = getSiteUrl();
  const path = `${site}${capabilityPath(capability.slug)}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${path}#service`,
        url: path,
        name: capability.inquiryProductName,
        serviceType: capability.categoryMatch,
        description: capability.seoDescription,
        image: `${site}${capability.heroImage.src}`,
        provider: { "@id": `${site}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
          { "@type": "ListItem", position: 2, name: "Capabilities", item: `${site}${CAPABILITIES_PATH}` },
          { "@type": "ListItem", position: 3, name: capability.navTitle, item: path },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: capability.buyerFaqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <CapabilityDetail capability={capability} caseStudies={caseStudies} articles={articles} />
  </>;
}
