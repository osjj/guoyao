import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { InquiryButton } from "@/components/site/inquiry-contact";
import { MetalMotion } from "@/components/site/metal-motion";
import { MaterialExplorer } from "@/components/site/material-explorer";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: "GUOYAO METAL | Architectural Metalworks" },
  description: "Metal, made remarkable. Explore a considered world of architectural metalwork, material expression and sculptural detail with Guoyao Metal.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <MetalMotion className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <Image src="/images/metal/hero-sculpture.webp" alt="Geometric bronze and reflective metal sculpture in a dark architectural setting" fill preload sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <p className={styles.kickerLight}><span />ARCHITECTURAL METALWORKS</p>
          <h1 id="home-title">Metal, made<br /><em>remarkable.</em></h1>
          <p className={styles.heroDescription}>An exploration of material, light and form.<br />A new expression for the spaces we inhabit.</p>
          <div className={styles.heroActions}>
            <Link href="/case-studies" className={styles.solidButton}>Explore case studies <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <InquiryButton className={styles.lightLink}>Start a conversation <ArrowUpRight size={16} aria-hidden="true" /></InquiryButton>
          </div>
        </div>
        <div className={styles.heroBottom}><a href="#perspective"><ArrowDown size={15} aria-hidden="true" />DISCOVER THE PERSPECTIVE</a><span>GUANGZHOU, CHINA</span><span>CONCEPT VISUAL</span></div>
      </section>

      <section id="perspective" className={styles.intro} aria-labelledby="perspective-title">
        <div className={styles.container}>
          <div className={styles.introGrid} data-metal-reveal>
            <p className={styles.kicker}>01 / THE GUOYAO PERSPECTIVE</p>
            <div><h2 id="perspective-title">More than a surface.<br /><em>A sense of place.</em></h2><div className={styles.introBody}><p>Metal can frame a space, catch the light or quietly change the way a room feels. We look at each detail as part of a larger architectural idea.</p><Link href="/about" className={styles.textLink}>Meet Guoyao Metal <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
          </div>
          <div className={styles.materialWords} aria-label="Design considerations"><span>Material</span><i>×</i><span>Form</span><i>×</i><span>Detail</span></div>
        </div>
      </section>

      <section className={styles.studies} aria-labelledby="studies-title">
        <div className={styles.container}>
          <div className={styles.sectionHead} data-metal-reveal><div><p className={styles.kicker}>02 / DESIGN IN CONTEXT</p><h2 id="studies-title">Ideas with <em>presence.</em></h2></div><Link href="/case-studies" className={styles.textLink}>The case study collection <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          <div className={styles.studyGrid}>
            <Link href="/case-studies" className={styles.studyCard} data-metal-reveal>
              <div className={styles.studyImage}><Image src="/images/metal/project-bronze.webp" alt="Concept study of a building facade with rhythmic bronze fins" fill sizes="(min-width: 800px) 56vw, 100vw" /><span>01 / ARCHITECTURAL EXPRESSION</span></div>
              <div className={styles.cardTitle}><h3>Rhythm in architecture</h3><ArrowUpRight size={22} aria-hidden="true" /></div><p>Line, repetition and the changing character of light.</p><span className={styles.conceptLabel}>DESIGN CONCEPT</span>
            </Link>
            <Link href="/case-studies" className={styles.studyCard} data-metal-reveal>
              <div className={styles.studyImage}><Image src="/images/metal/project-reflective.webp" alt="Concept study of a polished reflective metal form in a stone interior" fill sizes="(min-width: 800px) 38vw, 100vw" /><span>02 / SCULPTURAL FORM</span></div>
              <div className={styles.cardTitle}><h3>A dialogue with space</h3><ArrowUpRight size={22} aria-hidden="true" /></div><p>Soft reflections. A strong sense of form.</p><span className={styles.conceptLabel}>DESIGN CONCEPT</span>
            </Link>
          </div>
        </div>
      </section>

      <MaterialExplorer />

      <section className={styles.detailSection} aria-labelledby="detail-title">
        <div className={styles.container}>
          <div className={styles.detailGrid}>
            <figure data-metal-reveal><div className={styles.detailImage}><Image src="/images/metal/craft-finishing.webp" alt="Illustrative closeup of a brushed metal corner being hand finished" fill sizes="(min-width: 850px) 50vw, 100vw" /></div><figcaption>ILLUSTRATIVE CRAFT STUDY</figcaption></figure>
            <div className={styles.detailCopy} data-metal-reveal><p className={styles.kicker}>04 / THE DETAIL MATTERS</p><h2 id="detail-title">A closer look.<br /><em>A clearer idea.</em></h2><p>A convincing material expression begins with the small decisions: a line, an edge, a finish, a junction. Bring your references and project context into the conversation.</p><div className={styles.detailSteps}><div><span>01</span>Share the vision</div><div><span>02</span>Consider the material</div><div><span>03</span>Explore the details</div></div><InquiryButton className={styles.textLink}>Discuss the possibilities <ArrowUpRight size={17} aria-hidden="true" /></InquiryButton></div>
          </div>
        </div>
      </section>

      <section className={styles.journal} aria-labelledby="journal-title">
        <div className={styles.container}>
          <div className={styles.journalGrid} data-metal-reveal><div><p className={styles.kicker}>05 / THE JOURNAL</p><h2 id="journal-title">Thoughts behind<br /><em>the material.</em></h2></div><div><p>A place for observations on metal, architectural details and the relationship between materials and spaces.</p><Link href="/blog" className={styles.textLink}>Explore the journal <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
        </div>
      </section>
    </MetalMotion>
  );
}
