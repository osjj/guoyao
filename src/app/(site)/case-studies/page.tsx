import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedCaseStudies } from "@/lib/public-case-studies";
import { ContentState, EditorialImage, EditorialIntro, loadEditorialContent } from "@/components/site/metal-editorial";
import styles from "@/components/site/metal-editorial.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies — Material in Context",
  description: "Explore published Guoyao Metal project stories, with the material choices, design briefs and architectural details behind each space.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const result = await loadEditorialContent(getPublishedCaseStudies());
  const studies = result.available ? result.data : [];

  return <div className={styles.page}>
    <EditorialIntro label="Material in context / Case studies" title={<>Material meets<br /><em>its setting.</em></>}
      description="A space is shaped by its details. Our project archive brings together the briefs, material decisions and ideas behind published work."
      note="Architecture / Interiors / Metalworks" />
    <EditorialImage src="/images/metal/project-bronze.webp" alt="Architectural design concept of a building facade with repeated bronze fins" caption="Architectural concept · Design inspiration" />

    <section className={`${styles.container} ${styles.section}`} aria-labelledby="projects-heading">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>The project archive</p><h2 id="projects-heading">Every setting has a story.</h2></div>
        {result.available && <span className={styles.count}>{String(studies.length).padStart(2, "0")} / {studies.length === 1 ? "PROJECT" : "PROJECTS"}</span>}
      </div>
      {!result.available ? <ContentState unavailable type="projects" /> : studies.length === 0 ? <ContentState type="projects" /> : <div className={styles.caseGrid}>
        {studies.map((study, index) => <article key={study.slug} className={styles.caseCard}>
          <Link href={`/case-studies/${study.slug}`} aria-label={`View ${study.title}`}>
            <div className={styles.cardImage}>
              {study.coverImage ? <Image src={study.coverImage} alt={study.coverImageAlt ?? study.title} fill unoptimized sizes="(min-width: 761px) 45vw, 92vw" /> : <div className={styles.noCover}><span>{String(index + 1).padStart(2, "0")}</span><span>Project record / Guoyao Metal</span></div>}
            </div>
            <div className={styles.meta}><span>{String(index + 1).padStart(2, "0")} / Project story</span><span>{study.category}</span></div>
            <h3>{study.title}</h3>
          </Link>
          <p>{study.excerpt}</p>
          <Link href={`/case-studies/${study.slug}`} className={styles.textLink}>Explore the project<ArrowUpRight size={18} aria-hidden="true" /></Link>
        </article>)}
      </div>}
    </section>
  </div>;
}
