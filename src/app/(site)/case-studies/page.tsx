import type { Metadata } from "next";
import { getPublishedCaseStudySummaries } from "@/lib/public-case-studies";
import { loadEditorialContent } from "@/components/site/metal-editorial";
import { CaseStudiesArchive } from "@/components/site/case-studies-archive";
import { SITE_NAME } from "@/lib/site-identity";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Architectural Metalwork Case Studies",
  description:
    "Explore published Guoyao Metal project stories, with the material choices, design briefs and architectural details behind each space.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Architectural Metalwork Case Studies",
    type: "website",
    url: "/case-studies",
    siteName: SITE_NAME,
    description:
      "Explore published Guoyao Metal project stories, with the material choices, design briefs and architectural details behind each space.",
    images: [
      {
        url: "/images/home-projects/column-assembly.webp",
        alt: "Sculptural metal column cladding during workshop pre-assembly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Architectural Metalwork Case Studies",
    description:
      "Explore published Guoyao Metal project stories, with the material choices, design briefs and architectural details behind each space.",
    images: [
      {
        url: "/images/home-projects/column-assembly.webp",
        alt: "Sculptural metal column cladding during workshop pre-assembly",
      },
    ],
  },
};

export default async function CaseStudiesPage() {
  const studies = await loadEditorialContent(getPublishedCaseStudySummaries());
  return <CaseStudiesArchive studies={studies} />;
}
