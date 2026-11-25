import { Style13FoldedAlloy } from "@/components/site/home-styles/style-13-folded-alloy";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "GUOYAO METAL | Custom Architectural Metalwork",
  description:
    "Custom architectural metal facades, curved cladding, sculptural staircases, and luxury display vitrines, engineered and trial-assembled by Guoyao Metal.",
  path: "/",
  image: {
    url: "/images/redesign/cartier-night-lattice.webp",
    alt: "Illuminated geometric architectural metal storefront facade at night",
  },
});

export default function HomePage() {
  return <Style13FoldedAlloy />;
}
