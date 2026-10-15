import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { CustomerCaseStudy } from "@/data/shangri-la-case-study";
import { getCaseSectionImages, getCaseVideoSectionId } from "@/lib/case-study-content";
import { SITE_NAME } from "@/lib/site-identity";
import { getSiteUrl } from "@/lib/site-url";
import { CaseStudyImageGallery } from "./case-study-image-gallery";
import { CaseStudyVideoPlayer } from "./case-study-video";
import styles from "./metal-editorial.module.css";

export function MetalCaseStudyArticle({ study, preview = false }: { study: CustomerCaseStudy; preview?: boolean }) {
  const siteUrl = getSiteUrl();
  const videoSectionId = getCaseVideoSectionId(study.sections);
  let conclusionId = "project-reflections";
  let conclusionSuffix = 2;
  while (study.sections.some((section) => section.id === conclusionId)) {
    conclusionId = `project-reflections-${conclusionSuffix++}`;
  }
  const relatedLinks = study.relatedLinks.filter((link) => {
    try {
      const target = new URL(link.href, siteUrl);
      return !/^\/(products|guides)(\/|$)/.test(target.pathname);
    } catch { return false; }
  });
  const structuredData = {
    "@context": "https://schema.org", "@graph": [
      {
        "@type": "Article", headline: study.title, description: study.excerpt,
        dateModified: study.updatedAt, mainEntityOfPage: `${siteUrl}/case-studies/${study.slug}`,
        ...(study.coverImage ? { image: new URL(study.coverImage, siteUrl).href } : {}),
        publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: SITE_NAME },
      },
      {
        "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Case Studies", item: `${siteUrl}/case-studies` },
          { "@type": "ListItem", position: 3, name: study.title, item: `${siteUrl}/case-studies/${study.slug}` },
        ],
      },
    ],
  };

  return <article className={styles.page}>
    {!preview && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />}
    <header className={`${styles.container} ${styles.detailHeader}`}>
      <Link href="/case-studies" className={styles.back}><ArrowLeft size={15} aria-hidden="true" />Back to case studies</Link>
      <p className={styles.eyebrow}>{study.category}</p>
      <h1>{study.title}</h1><p className={styles.detailSummary}>{study.excerpt}</p>
      <div className={styles.meta}><span>Project story / Guoyao Metal</span></div>
    </header>
    {study.coverImage && <div className={styles.container}><div className={styles.detailCover}>
      <Image src={study.coverImage} alt={study.coverImageAlt ?? study.title} fill preload unoptimized sizes="(min-width: 1600px) 1440px, 92vw" />
    </div></div>}
    <div className={styles.container}>
      <section className={styles.projectIntro} aria-labelledby="project-overview"><div><p className={styles.eyebrow}>The project</p><h2 id="project-overview">A closer look at the brief.</h2></div><p>{study.introduction}</p></section>
      {study.stats.length > 0 && <dl className={styles.stats} aria-label="Project at a glance">{study.stats.map((stat, index) => <div key={`${stat.label}-${index}`}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>}
    </div>
    <div className={`${styles.container} ${styles.readingLayout}`}>
      <aside className={styles.contents}>
        <nav aria-label="In this case study"><p className={styles.eyebrow}>Inside the project</p><ol>{study.video && <li><a href={`#${videoSectionId}`}>Project video</a></li>}{study.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.navLabel}</a></li>)}<li><a href={`#${conclusionId}`}>Project reflections</a></li></ol></nav>
        {relatedLinks.length > 0 && <nav className={styles.related} aria-label="Related reading"><p className={styles.eyebrow}>Related reading</p><ol>{relatedLinks.map((link, index) => <li key={`${link.href}-${index}`}><Link href={link.href}>{link.label}</Link></li>)}</ol></nav>}
      </aside>
      <div className={styles.prose}>
        {study.video && <section id={videoSectionId} className={styles.projectSection} aria-label={study.video.title}>
          <p className={styles.eyebrow}>Project video</p><h2>{study.video.title}</h2>
          <CaseStudyVideoPlayer video={study.video} />
        </section>}
        {study.sections.map((section, index) => <section id={section.id} key={section.id} className={styles.projectSection}>
          <p className={styles.eyebrow}>{String(index + 1).padStart(2, "0")} / {section.navLabel}</p><h2>{section.title}</h2>
          {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          <CaseStudyImageGallery images={getCaseSectionImages(section)} label={section.title} />
          {section.points && <ul className={styles.points}>{section.points.map((point, pointIndex) => <li key={pointIndex}><h3>{point.title}</h3><p>{point.text}</p></li>)}</ul>}
          {section.table && <div className={styles.tableWrap}><table><caption>{section.table.caption}</caption><thead><tr>{section.table.headings.map((heading, headingIndex) => <th scope="col" key={headingIndex}>{heading}</th>)}</tr></thead><tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>}
        </section>)}
        <section id={conclusionId} className={styles.projectConclusion}><p className={styles.eyebrow}>Project reflections</p><h2>From the brief to the detail.</h2><p>{study.conclusion}</p></section>
      </div>
    </div>
    <footer className={styles.readingEnd}><div className={styles.container}><span>Discover more material stories.</span><Link href="/case-studies" className={styles.textLink}>Explore case studies<ArrowUpRight size={18} aria-hidden="true" /></Link></div></footer>
  </article>;
}
