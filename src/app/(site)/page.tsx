import { Style13FoldedAlloy } from "@/components/site/home-styles/style-13-folded-alloy";
import { loadEditorialContent } from "@/components/site/metal-editorial";
import { FEATURED_ARTICLE, PREFERRED_FEATURED_ARTICLE_SLUG } from "@/data/homepage-redesign-data";
import { getEditorialSeo } from "@/lib/editorial-seo";
import { getPublishedBlogPostBySlug } from "@/lib/public-blog";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 300;

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

export default async function HomePage() {
  const preferred = await loadEditorialContent(getPublishedBlogPostBySlug(PREFERRED_FEATURED_ARTICLE_SLUG))
    .catch(() => null);
  if (!preferred) return <Style13FoldedAlloy />;

  const seo = getEditorialSeo("blog", preferred);
  return <Style13FoldedAlloy featuredArticle={{
    href: `/blog/${preferred.slug}`,
    kicker: FEATURED_ARTICLE.kicker,
    title: seo.title,
    summary: seo.description,
    image: { src: preferred.coverImage, alt: preferred.coverImageAlt },
  }} />;
}
