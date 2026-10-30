import type { HeroPhoto } from "@/components/site/hero-carousel";

export const homepageHeroPhotos = [
  {
    src: "/images/home-projects/extra/cartier-night.webp",
    alt: "Installed geometric metal storefront facade with illuminated Cartier lettering at night",
    category: "RETAIL / INSTALLED VIEW",
    caption: "A facade with a different rhythm.",
  },
  {
    src: "/images/home-projects/hero-tiffany-front.webp",
    alt: "Front view of a Tiffany boutique with illuminated fluted metal facade panels",
    category: "RETAIL / INSTALLED VIEW",
    caption: "A surface that comes alive in light.",
    position: "50% 55%",
  },
  {
    src: "/images/home-projects/hero-golden-escalators.webp",
    alt: "Symmetrical gold-toned ribbed metal cladding framing two escalator entrances",
    category: "ARCHITECTURAL CLADDING / INSTALLED VIEW",
    caption: "Sculpted metal, at architectural scale.",
  },
  {
    src: "/images/home-projects/hero-hammered-display.webp",
    alt: "Illuminated glass display cabinet with a hammered gold-toned metal frame",
    category: "DISPLAY FIXTURES / COMPLETED PIECE",
    caption: "The detail, brought into focus.",
    position: "50% 55%",
  },
] as const satisfies readonly HeroPhoto[];
