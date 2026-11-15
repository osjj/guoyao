import type { HeroPhoto } from "@/components/site/hero-carousel";

export const homepageHeroPhotos = [
  {
    src: "/images/home-slideshow/golden-escalator-lobby.webp",
    alt: "Symmetrical gold-toned ribbed metal cladding around two escalators in a marble lobby",
    category: "ARCHITECTURAL CLADDING / INSTALLED VIEW",
    caption: "Sculpted metal, at architectural scale.",
  },
  {
    src: "/images/home-slideshow/illuminated-boutique-corner.webp",
    alt: "Corner view of a boutique with illuminated textured metal facade panels at dusk",
    category: "RETAIL / INSTALLED VIEW",
    caption: "A surface that comes alive in light.",
    position: "50% 50%",
  },
  {
    src: "/images/home-slideshow/gold-and-white-storefront.webp",
    alt: "Cartier storefront with sculpted white vertical panels and textured gold-toned metal surfaces",
    category: "RETAIL / INSTALLED VIEW",
    caption: "A facade with a different rhythm.",
    position: "50% 45%",
  },
  {
    src: "/images/home-slideshow/curved-illuminated-facade.webp",
    alt: "Curved Tiffany boutique facade with blue illuminated textured panels during site work",
    category: "RETAIL / ON-SITE VIEW",
    caption: "Light, following a curved form.",
  },
  {
    src: "/images/home-slideshow/curved-stair-balustrade.webp",
    alt: "Overhead view of a curved metal stair balustrade and dark handrail during site work",
    category: "STAIRS / ON-SITE WORK",
    caption: "A line through the space.",
    position: "50% 85%",
  },
] as const satisfies readonly HeroPhoto[];
