import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getPublishedCaseStudySummaries } from "@/lib/public-case-studies";
import { loadEditorialContent } from "@/components/site/metal-editorial";
import { ArchiveState } from "@/components/site/metal-archive-ui";
import styles from "@/components/site/metal-archives.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies — Material in Context",
  description: "Explore published Guoyao Metal project stories, with the material choices, design briefs and architectural details behind each space.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const result = await loadEditorialContent(getPublishedCaseStudySummaries());
  const studies = result.available ? result.data : [];
  const [lead, ...remaining] = studies;

  return <div className={styles.projectsPage}>
    <section className={`${styles.container} ${styles.projectOpening}`} aria-labelledby="projects-heading">
      <header className={styles.projectIntro}>
        <p className={styles.eyebrow}>Guoyao Metal / Selected work</p>
        <h1 id="projects-heading">Material, <br /><em>in context.</em></h1>
        <p className={styles.introDescription}>From the first drawing to the finished setting. A closer look at the forms, surfaces and decisions behind our architectural metalwork.</p>
        {remaining.length > 0 && <a className={styles.quietLink} href="#project-archive">Browse the project stories<ArrowDown size={16} aria-hidden="true" /></a>}
        <div className={styles.projectIndex}>
          <span>THE PROJECT ARCHIVE</span>
          {result.available ? <p><strong>{String(studies.length).padStart(2, "0")}</strong><span>Published {studies.length === 1 ? "project" : "projects"}<br />Details, documented.</span></p> : <p className={styles.indexNote}>Architecture. Interiors.<br />The making, in detail.</p>}
        </div>
      </header>
      {lead ? <article className={styles.projectLead}>
        <Link href={`/case-studies/${lead.slug}`} className={styles.leadImage} aria-label={`View ${lead.title}`}>
          {lead.coverImage ? <Image src={lead.coverImage} alt={lead.coverImageAlt ?? lead.title} fill unoptimized preload sizes="(min-width: 1000px) 62vw, 92vw" /> : <div className={styles.imagePlaceholder}>Guoyao Metal / Project 01</div>}
          <span className={styles.imageIndex}>01 / PROJECT STORY</span>
          <span className={styles.imageArrow}><ArrowUpRight size={23} aria-hidden="true" /></span>
        </Link>
        <div className={styles.leadCaption}>
          <p className={styles.category}>{lead.category}</p>
          <h2><Link href={`/case-studies/${lead.slug}`}>{lead.title}</Link></h2>
          <p className={styles.excerpt}>{lead.excerpt}</p>
          <Link href={`/case-studies/${lead.slug}`} className={styles.quietLink}>Inside the project<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </article> : <ArchiveState type="projects" unavailable={!result.available} />}
    </section>
    {remaining.length > 0 && <section id="project-archive" className={`${styles.container} ${styles.moreProjects}`} aria-labelledby="more-projects-heading">
      <div className={styles.sectionHeading}><h2 id="more-projects-heading">More project stories</h2><span>02 — {String(studies.length).padStart(2, "0")}</span></div>
      <div className={styles.projectGrid}>
        {remaining.map((study, index) => <article key={study.slug} className={styles.projectCard}>
          <Link href={`/case-studies/${study.slug}`} className={styles.projectImage} aria-label={`View ${study.title}`}>
            {study.coverImage ? <Image src={study.coverImage} alt={study.coverImageAlt ?? study.title} fill unoptimized sizes="(min-width: 761px) 45vw, 92vw" /> : <div className={styles.imagePlaceholder}>Guoyao Metal / Project record</div>}
            <span className={styles.imageArrow}><ArrowUpRight size={22} aria-hidden="true" /></span>
          </Link>
          <div className={styles.cardMeta}><span>{String(index + 2).padStart(2, "0")}</span><p className={styles.category}>{study.category}</p></div>
          <h3><Link href={`/case-studies/${study.slug}`}>{study.title}</Link></h3>
          <p className={styles.excerpt}>{study.excerpt}</p>
          <Link href={`/case-studies/${study.slug}`} className={styles.quietLink}>Inside the project<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </article>)}
      </div>
    </section>}
  </div>;
}
