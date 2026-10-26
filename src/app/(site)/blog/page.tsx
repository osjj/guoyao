import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedBlogPostSummaries } from "@/lib/public-blog";
import { loadEditorialContent } from "@/components/site/metal-editorial";
import { ArchiveState } from "@/components/site/metal-archive-ui";
import { SITE_NAME } from "@/lib/site-identity";
import { canOptimizeImage } from "@/lib/image-optimization";
import styles from "@/components/site/metal-archives.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Architectural Metal & Finishes Blog",
  description: "Perspectives on architectural metal, surface finishes and the details that shape a space. Read the Guoyao Metal journal.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Architectural Metal & Finishes Blog", type: "website", url: "/blog", siteName: SITE_NAME,
    description: "Perspectives on architectural metal, surface finishes and the details that shape a space. Read the Guoyao Metal journal.",
    images: [{ url: "/images/home-projects/extra/entrance-joint-detail.webp", alt: "Connection detail of a curved architectural metal entrance framework" }],
  },
  twitter: {
    card: "summary_large_image", title: "Architectural Metal & Finishes Blog",
    description: "Perspectives on architectural metal, surface finishes and the details that shape a space. Read the Guoyao Metal journal.",
    images: [{ url: "/images/home-projects/extra/entrance-joint-detail.webp", alt: "Connection detail of a curved architectural metal entrance framework" }],
  },
};

const topics = ["Materials & finishes", "Architecture & interiors", "Details & craftsmanship"];

export default async function BlogPage() {
  const articles = await loadEditorialContent(getPublishedBlogPostSummaries());
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const remaining = featured ? articles.filter((article) => article.id !== featured.id) : [];

  return <div className={styles.journalPage}>
    <header className={`${styles.container} ${styles.journalMasthead}`}>
      <div className={styles.mastheadLine}><p className={styles.eyebrow}>Guoyao Metal / Ideas & observations</p><span>Material. Detail. Perspective.</span></div>
      <div className={styles.mastheadTitle}><h1 id="journal-heading">The Material Journal.</h1><p>Notes on what we make, <br />and what goes into the making.</p></div>
    </header>
    <section className={styles.container} aria-label="Featured article">
      {featured ? <article className={styles.featureArticle}>
        <Link href={`/blog/${featured.slug}`} className={`${styles.featureImage} ${featured.coverImageFit === "contain" ? styles.contain : ""}`} aria-label={`Read ${featured.title}`}>
          <Image src={featured.coverImage} alt={featured.coverImageAlt} fill unoptimized={!canOptimizeImage(featured.coverImage)} preload sizes="(min-width: 1000px) 52vw, 92vw" />
        </Link>
        <div className={styles.featureCopy}>
          <p className={styles.featureLabel}><span>EDITOR’S SELECTION</span><span>{featured.readTime}</span></p>
          <p className={styles.category}>{featured.category}</p>
          <h2><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2>
          <p className={styles.excerpt}>{featured.excerpt}</p>
          <div className={styles.featureEnd}><time dateTime={featured.publishedAt}>{featured.publishedLabel}</time><Link className={styles.quietLink} href={`/blog/${featured.slug}`}>Read article<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        </div>
      </article> : <ArchiveState type="articles" />}
    </section>
    {remaining.length > 0 && <section id="journal-archive" className={`${styles.container} ${styles.journalArchive}`} aria-labelledby="reading-heading">
      <div className={styles.sectionHeading}><h2 id="reading-heading">Further reading</h2><span>{String(articles.length).padStart(2, "0")} ARTICLES IN THE JOURNAL</span></div>
      <div>
        {remaining.map(article => <article className={styles.articleRow} key={article.id}>
          <div className={styles.articleDate}><time dateTime={article.publishedAt}>{article.publishedLabel}</time><span>{article.readTime}</span></div>
          <div className={styles.articleCopy}>
            <p className={styles.category}>{article.category}</p>
            <h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3>
            <p className={styles.excerpt}>{article.excerpt}</p>
            <Link className={styles.quietLink} href={`/blog/${article.slug}`}>Read article<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <Link href={`/blog/${article.slug}`} className={`${styles.articleImage} ${article.coverImageFit === "contain" ? styles.contain : ""}`} aria-label={`Read ${article.title}`}>
            <Image src={article.coverImage} alt={article.coverImageAlt} fill unoptimized={!canOptimizeImage(article.coverImage)} sizes="(min-width: 1000px) 280px, (min-width: 601px) 220px, 100px" />
          </Link>
        </article>)}
      </div>
    </section>}
    <aside className={`${styles.container} ${styles.editorialLens}`} aria-label="Journal topics">
      <p className={styles.eyebrow}>Our editorial lens</p>
      <ul>{topics.map((topic, index) => <li key={topic}><span>0{index + 1}</span>{topic}</li>)}</ul>
    </aside>
  </div>;
}
