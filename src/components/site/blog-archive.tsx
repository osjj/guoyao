"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import { canOptimizeImage } from "@/lib/image-optimization";
import { ArchiveState } from "@/components/site/metal-archive-ui";
import { HammeredBronzeCanvas } from "@/components/site/alloy-metal-canvases";
import { EmberField } from "@/components/site/home-styles/style-10-liquid-effects";
import mirror from "@/components/site/home-styles/style-10-liquid.module.css";
import styles from "./alloy-subpages.module.css";

export type BlogArchiveArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  coverImage: string;
  coverImageAlt: string;
  coverImageFit?: "contain" | "cover";
  featured: boolean;
  publishedAt: string;
  publishedLabel: string;
};

const EDITORIAL_TOPICS = [
  {
    num: "01",
    title: "Materials & finishes",
    description:
      "Directional brushing, antique brass patination, mirror stainless steel, and grazing-light surface control.",
  },
  {
    num: "02",
    title: "Architecture & interiors",
    description:
      "Illuminated boutique elevations, curved atrium cladding, sculptural staircases, and bespoke display vitrines.",
  },
  {
    num: "03",
    title: "Details & craftsmanship",
    description:
      "TIG and laser welding standards, concealed subframe tolerances, mitered nodes, and 1:1 workshop verification.",
  },
] as const;

function trackCardSheen(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

export function BlogArchive({ articles }: { articles: BlogArchiveArticle[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const featured = useMemo(
    () => articles.find((article) => article.featured) ?? articles[0],
    [articles],
  );

  const remainingAll = useMemo(
    () => (featured ? articles.filter((article) => article.id !== featured.id) : []),
    [articles, featured],
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(remainingAll.map((a) => a.category).filter(Boolean)));
    return unique.length > 1 ? ["All", ...unique] : [];
  }, [remainingAll]);

  const remaining = useMemo(() => {
    if (selectedCategory === "All") return remainingAll;
    return remainingAll.filter((article) => article.category === selectedCategory);
  }, [remainingAll, selectedCategory]);

  return (
    <div className={styles.page}>
      <header className={styles.journalMasthead} aria-labelledby="journal-heading">
        <div className={styles.metalHeroCanvasWrap}>
          <HammeredBronzeCanvas className={styles.metalHeroCanvas} />
          <EmberField className={mirror.emberCanvas} density={22} />
          <div className={styles.bronzeHeroScrim} aria-hidden="true" />
        </div>

        <div className={`${mirror.container} ${styles.journalMastheadInner}`}>
          <div className={styles.mastheadStrip}>
            <span className={styles.mastheadStripLead}>
              <span className={mirror.liveDot} aria-hidden="true" />
              Hand-Hammered Bronze · Ideas &amp; Observations
            </span>
            <span>
              {String(articles.length).padStart(2, "0")} Published{" "}
              {articles.length === 1 ? "Article" : "Articles"}
            </span>
            <span>Move cursor to catch bronze facets · Click to ripple</span>
          </div>

          <div className={styles.mastheadMain}>
            <h1 id="journal-heading" className={styles.mastheadTitle}>
              <span className={mirror.chromeText}>The Material</span>
              <span className={mirror.heroItalic}>Journal.</span>
            </h1>

            <div className={styles.mastheadAside}>
              <p>
                Notes on what we make and what goes into the making—covering alloy selection,
                surface finishing, welding tolerances, and architectural detailing from our
                Guangzhou studio.
              </p>
              <div className={styles.mastheadMetaRow}>
                <span className={styles.mastheadTag}>Materials &amp; Finishes</span>
                <span className={styles.mastheadTag}>Welding &amp; Tolerances</span>
                <span className={styles.mastheadTag}>Craftsmanship</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        id="featured-article"
        className={styles.journalFeatureSection}
        aria-label="Featured article"
      >
        <div className={mirror.container}>
          {featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              className={styles.featuredArticle}
              onPointerMove={trackCardSheen}
            >
              <div
                className={`${styles.featuredVisual} ${
                  featured.coverImageFit === "contain" ? styles.containVisual : ""
                }`}
              >
                <Image
                  src={featured.coverImage}
                  alt={featured.coverImageAlt}
                  fill
                  priority
                  unoptimized={!canOptimizeImage(featured.coverImage)}
                  sizes="(min-width: 1020px) 52vw, 94vw"
                />
              </div>

              <div className={styles.featuredBody}>
                <div className={styles.featuredTopMeta}>
                  <span className={styles.editorPill}>Editor’s Selection</span>
                  <span className={styles.readTimeBadge}>{featured.readTime}</span>
                </div>
                <p className={mirror.caseCat}>{featured.category}</p>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <div className={styles.featuredFoot}>
                  <time dateTime={featured.publishedAt}>{featured.publishedLabel}</time>
                  <span className={mirror.inlineLink}>
                    Read article <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <ArchiveState type="articles" />
          )}
        </div>
      </section>

      {remainingAll.length > 0 && (
        <section
          id="journal-archive"
          className={styles.archiveSection}
          aria-labelledby="reading-heading"
        >
          <div className={mirror.container}>
            <div className={styles.archiveBar}>
              <div>
                <p className={mirror.eyebrow}>
                  <BookOpen size={13} aria-hidden="true" /> Further Reading
                </p>
                <h2 id="reading-heading" className={mirror.sectionTitle}>
                  Workshop notes &amp;{" "}
                  <span className={mirror.displayItalic}>technical guides.</span>
                </h2>
                <p className={styles.archiveCount}>
                  {String(articles.length).padStart(2, "0")} articles in the journal
                </p>
              </div>

              {categories.length > 0 && (
                <div
                  className={mirror.filterGroup}
                  role="group"
                  aria-label="Filter journal articles by category"
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={selectedCategory === category}
                      className={`${mirror.pillTab} ${
                        selectedCategory === category ? mirror.pillTabActive : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.journalList}>
              {remaining.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className={styles.journalRow}
                  onPointerMove={trackCardSheen}
                >
                  <div className={styles.rowDateCol}>
                    <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
                    <span>{article.readTime}</span>
                  </div>

                  <div className={styles.rowCopyCol}>
                    <p className={mirror.caseCat}>{article.category}</p>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <span className={mirror.inlineLink}>
                      Read article <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </div>

                  <div
                    className={`${styles.rowThumb} ${
                      article.coverImageFit === "contain" ? styles.containVisual : ""
                    }`}
                  >
                    <Image
                      src={article.coverImage}
                      alt={article.coverImageAlt}
                      fill
                      unoptimized={!canOptimizeImage(article.coverImage)}
                      sizes="(min-width: 1020px) 260px, (min-width: 681px) 210px, 92vw"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <aside className={styles.lensSection} aria-label="Journal topics">
        <div className={mirror.container}>
          <div className={mirror.sectionHeader}>
            <div>
              <p className={mirror.eyebrow}>Our Editorial Lens</p>
              <h2 className={mirror.sectionTitle}>
                Three disciplines <span className={mirror.displayItalic}>we write about.</span>
              </h2>
            </div>
          </div>
          <div className={styles.lensGrid}>
            {EDITORIAL_TOPICS.map((topic) => (
              <div key={topic.num} className={styles.lensCard}>
                <span className={styles.lensNum}>{topic.num}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
