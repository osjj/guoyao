import { StyleSwitcherShell } from "@/components/site/home-styles/style-switcher-shell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "GUOYAO METAL | Custom Architectural Metalwork",
  description:
    "Explore five bespoke homepage UI concepts for Guoyao Metal — custom architectural metal facades, curved cladding, sculptural staircases, and luxury display vitrines.",
  path: "/",
  image: {
    url: "/images/redesign/cartier-night-lattice.webp",
    alt: "Illuminated geometric architectural metal storefront facade at night",
  },
});

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ style?: string; chrome?: string }>;
}) {
  const params = await searchParams;
  const parsed = Number(params.style);
  const initialStyle = (parsed >= 1 && parsed <= 5 ? parsed : 1) as 1 | 2 | 3 | 4 | 5;
  const initialClean = params.chrome === "clean";

  return <StyleSwitcherShell initialStyle={initialStyle} initialClean={initialClean} />;
}
