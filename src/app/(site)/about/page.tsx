import { AboutFoldedAlloy } from "@/components/site/about-folded-alloy";
import { REDESIGN_IMAGES } from "@/data/homepage-redesign-data";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

const heroImage = REDESIGN_IMAGES.escalatorPodWorkshop;

export const metadata = createPageMetadata({
  title: "About Our Architectural Metalwork Workshop | GUOYAO METAL",
  description:
    "Meet Guoyao Metal, an architectural metalwork workshop in Guangzhou, Guangdong. See how our team engineers, fabricates, finishes, and trial-assembles custom metalwork at 1:1 scale.",
  path: "/about",
  image: { url: heroImage.src, alt: heroImage.alt },
});

export default function AboutPage() {
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about#webpage`,
    url: `${siteUrl}/about`,
    name: "About Guoyao Metal",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <AboutFoldedAlloy />
    </>
  );
}
