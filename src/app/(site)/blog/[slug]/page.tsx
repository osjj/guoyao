import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArticleContentRenderer, headingId } from "@/components/site/article-content-renderer";
import { loadEditorialContent } from "@/components/site/metal-editorial";
import { getPublishedBlogPostBySlug } from "@/lib/public-blog";
import { plainTextFromEditorHtml, readStoredArticleContent } from "@/lib/article-content-server";
import { getSiteUrl } from "@/lib/site-url";
import { getEditorialSeo } from "@/lib/editorial-seo";
import { SITE_NAME } from "@/lib/site-identity";
import { canOptimizeImage } from "@/lib/image-optimization";
import styles from "@/components/site/metal-editorial.module.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
const getArticle = cache((slug: string) => loadEditorialContent(getPublishedBlogPostBySlug(slug)));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const seo = getEditorialSeo("blog", article);
  return {
    title: seo.title, description: seo.description,
    alternates: { canonical: `/blog/${article.slug}` },
    authors: [{ name: SITE_NAME, url: `${getSiteUrl()}/` }],
    openGraph: {
      type: "article", siteName: SITE_NAME, url: `/blog/${article.slug}`,
      title: seo.title, description: seo.description,
      publishedTime: article.publishedAt, modifiedTime: article.updatedAt.toISOString(),
      authors: [`${getSiteUrl()}/`],
      images: [{ url: article.coverImage, alt: article.coverImageAlt }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [article.coverImage] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const article = await getArticle((await params).slug);
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
        author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: SITE_NAME, url: `${siteUrl}/` },
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
      <div className={styles.meta}><span>By <Link href="/about">{SITE_NAME}</Link></span><span>Published <time dateTime={article.publishedAt}>{article.publishedLabel}</time></span><span>Updated <time dateTime={article.updatedAt.toISOString()}>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(article.updatedAt)}</time></span><span>{article.readTime}</span></div>
    </header>
    <div className={styles.container}><div className={`${styles.detailCover} ${article.coverImageFit === "contain" ? styles.contain : ""}`}>
      <Image src={article.coverImage} alt={article.coverImageAlt} fill preload unoptimized={!canOptimizeImage(article.coverImage)} sizes="(min-width: 1600px) 1440px, 92vw" />
    </div></div>
    <div className={`${styles.container} ${styles.readingLayout}`}>
      <aside className={styles.contents}>
        {outline.length > 0 ? <nav aria-label="In this article"><p className={styles.eyebrow}>In this article</p><ol>{outline.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.title}</a></li>)}</ol></nav> : <p className={styles.eyebrow}>The material journal<br />Guoyao Metal</p>}
      </aside>
      <div className={styles.prose}><ArticleContentRenderer content={article.content} fallbackImageAlt={`Illustration for ${article.title}`} /></div>
    </div>
    <footer className={styles.readingEnd}><div className={styles.container}><span>More perspectives on material and space.</span><Link href="/blog" className={styles.textLink}>Explore the journal<ArrowUpRight size={18} aria-hidden="true" /></Link></div></footer>
  </article>;
}
