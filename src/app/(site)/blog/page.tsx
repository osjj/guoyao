import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedBlogPosts } from "@/lib/public-blog";
import { ContentState, EditorialImage, EditorialIntro, loadEditorialContent } from "@/components/site/metal-editorial";
import styles from "@/components/site/metal-editorial.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — The Material Journal",
  description: "Perspectives on architectural metal, surface finishes and the details that shape a space. Read the Guoyao Metal journal.",
  alternates: { canonical: "/blog" },
};

const topics = ["Materials & finishes", "Architecture & interiors", "Details & craftsmanship"];

export default async function BlogPage() {
  const result = await loadEditorialContent(getPublishedBlogPosts());
  const articles = result.available ? result.data : [];
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const remaining = featured ? articles.filter((article) => article.id !== featured.id) : [];

  return <div className={styles.page}>
    <EditorialIntro label="The material journal / Blog" title={<>A closer look.<br /><em>A new perspective.</em></>}
      description="Ideas, observations and practical notes from the world of architectural metal. A place to explore what a material can bring to a space."
      note="Material / Detail / Perspective" />
    <EditorialImage src="/images/metal/material-study.webp" alt="Architectural metal surfaces arranged as a material and finish study" caption="Material study · Concept imagery" />

    <section className={`${styles.container} ${styles.section}`} aria-labelledby="journal-heading">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>From the journal</p><h2 id="journal-heading">Notes worth a closer look.</h2></div>
        {result.available && <span className={styles.count}>{String(articles.length).padStart(2, "0")} / {articles.length === 1 ? "ARTICLE" : "ARTICLES"}</span>}
      </div>

      {!result.available ? <ContentState unavailable type="articles" /> : !featured ? <ContentState type="articles" /> : <>
        <Link href={`/blog/${featured.slug}`} className={styles.featured} aria-label={`Read ${featured.title}`}>
          <div className={`${styles.cardImage} ${featured.coverImageFit === "contain" ? styles.contain : ""}`}>
            <Image src={featured.coverImage} alt={featured.coverImageAlt} fill unoptimized sizes="(min-width: 1000px) 55vw, 92vw" />
          </div>
          <div className={styles.featuredCopy}>
            <div className={styles.meta}><span>Featured perspective</span><span>{featured.readTime}</span></div>
            <h3>{featured.title}</h3><p>{featured.excerpt}</p>
            <span className={styles.textLink}>Read the story<ArrowUpRight size={19} aria-hidden="true" /></span>
          </div>
        </Link>
        {remaining.length > 0 && <div className={styles.articleGrid}>
          {remaining.map((article) => <article key={article.id} className={styles.articleCard}>
            <Link href={`/blog/${article.slug}`}>
              <div className={`${styles.cardImage} ${article.coverImageFit === "contain" ? styles.contain : ""}`}>
                <Image src={article.coverImage} alt={article.coverImageAlt} fill unoptimized sizes="(min-width: 1000px) 30vw, (min-width: 461px) 45vw, 92vw" />
              </div>
              <div className={styles.meta}><span>{article.category}</span><time dateTime={article.publishedAt}>{article.publishedLabel}</time></div>
              <h3>{article.title}</h3>
            </Link>
            <p>{article.excerpt}</p>
            <Link href={`/blog/${article.slug}`} className={styles.textLink}>Read the story<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </article>)}
        </div>}
      </>}

      <div className={styles.topics}>
        <div><p className={styles.eyebrow}>Our editorial lens</p><h2>The conversations<br />that shape our thinking.</h2></div>
        <ul className={styles.topicList}>{topics.map((topic, index) => <li key={topic}><span>{String(index + 1).padStart(2, "0")}</span>{topic}<ArrowUpRight size={16} aria-hidden="true" /></li>)}</ul>
      </div>
    </section>
  </div>;
}
