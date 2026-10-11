import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleContentRenderer, headingId } from "@/components/site/article-content-renderer";
import { DetailUnavailable, loadEditorialContent } from "@/components/site/metal-editorial";
import { getPublishedBlogPostBySlug } from "@/lib/public-blog";
import { plainTextFromEditorHtml, readStoredArticleContent } from "@/lib/article-content-server";
import { getSiteUrl } from "@/lib/site-url";
import { SITE_NAME } from "@/lib/site-identity";
import styles from "@/components/site/metal-editorial.module.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await loadEditorialContent(getPublishedBlogPostBySlug((await params).slug));
  if (!result.available) return { title: "Article temporarily unavailable", robots: { index: false } };
  const article = result.data;
  if (!article) return { title: "Article not found", robots: { index: false } };
  return {
    title: article.title, description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article", siteName: SITE_NAME, url: `/blog/${article.slug}`,
      title: article.title, description: article.excerpt,
      publishedTime: article.publishedAt, modifiedTime: article.updatedAt.toISOString(),
      images: [{ url: article.coverImage, alt: article.coverImageAlt }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images: [article.coverImage] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const result = await loadEditorialContent(getPublishedBlogPostBySlug((await params).slug));
  if (!result.available) return <DetailUnavailable type="article" />;
  const article = result.data;
  if (!article) notFound();

  const usedIds = new Set<string>();
  const outline: { id: string; title: string }[] = [];
  readStoredArticleContent(article.content).blocks.forEach((block, index) => {
    if (block.type !== "header") return;
    const base = headingId(String(block.data.text ?? ""), index);
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    if (Number(block.data.level) === 2) outline.push({ id, title: plainTextFromEditorHtml(block.data.text) });
  });

  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org", "@graph": [
      {
        "@type": "Article", headline: article.title, description: article.excerpt,
        image: new URL(article.coverImage, siteUrl).href,
        datePublished: article.publishedAt, dateModified: article.updatedAt.toISOString(),
        mainEntityOfPage: `${siteUrl}/blog/${article.slug}`, articleSection: article.category,
        publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: SITE_NAME },
      },
      {
        "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: article.title, item: `${siteUrl}/blog/${article.slug}` },
        ],
      },
    ],
  };

  return <article className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className={`${styles.container} ${styles.detailHeader}`}>
      <Link href="/blog" className={styles.back}><ArrowLeft size={15} aria-hidden="true" />Back to the journal</Link>
      <p className={styles.eyebrow}>{article.category}</p>
      <h1>{article.title}</h1><p className={styles.detailSummary}>{article.excerpt}</p>
      <div className={styles.meta}><time dateTime={article.publishedAt}>{article.publishedLabel}</time><span>{article.readTime}</span><span>Guoyao Metal / Journal</span></div>
    </header>
    <div className={styles.container}><div className={`${styles.detailCover} ${article.coverImageFit === "contain" ? styles.contain : ""}`}>
      <Image src={article.coverImage} alt={article.coverImageAlt} fill preload unoptimized sizes="(min-width: 1600px) 1440px, 92vw" />
    </div></div>
    <div className={`${styles.container} ${styles.readingLayout}`}>
      <aside className={styles.contents}>
        {outline.length > 0 ? <nav aria-label="In this article"><p className={styles.eyebrow}>In this article</p><ol>{outline.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.title}</a></li>)}</ol></nav> : <p className={styles.eyebrow}>The material journal<br />Guoyao Metal</p>}
      </aside>
      <div className={styles.prose}><ArticleContentRenderer content={article.content} /></div>
    </div>
    <footer className={styles.readingEnd}><div className={styles.container}><span>More perspectives on material and space.</span><Link href="/blog" className={styles.textLink}>Explore the journal<ArrowUpRight size={18} aria-hidden="true" /></Link></div></footer>
  </article>;
}
