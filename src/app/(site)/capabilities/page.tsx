import { CapabilitiesIndex } from "@/components/site/capabilities-index";
import { CAPABILITIES, CAPABILITIES_OVERVIEW, CAPABILITIES_PATH, capabilityPath } from "@/data/capabilities";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const metadata = createPageMetadata({
  title: CAPABILITIES_OVERVIEW.seoTitle,
  description: CAPABILITIES_OVERVIEW.seoDescription,
  path: CAPABILITIES_PATH,
  image: { url: CAPABILITIES_OVERVIEW.heroImage.src, alt: CAPABILITIES_OVERVIEW.heroImage.alt },
});

export default function CapabilitiesPage() {
  const site = getSiteUrl();
  const path = `${site}${CAPABILITIES_PATH}`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${path}#page`,
        url: path,
        name: CAPABILITIES_OVERVIEW.h1,
        description: CAPABILITIES_OVERVIEW.seoDescription,
        image: `${site}${CAPABILITIES_OVERVIEW.heroImage.src}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: CAPABILITIES.map((capability, index) => ({
            "@type": "ListItem", position: index + 1, name: capability.navTitle, url: `${site}${capabilityPath(capability.slug)}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
          { "@type": "ListItem", position: 2, name: "Capabilities", item: path },
        ],
      },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <CapabilitiesIndex />
  </>;
}
