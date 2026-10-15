import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { InquiryButton } from "@/components/site/inquiry-contact";
import { MetalMotion } from "@/components/site/metal-motion";
import { MaterialExplorer } from "@/components/site/material-explorer";
import styles from "./home.module.css";

const applications = [
  { id: "exterior-rhythm", number: "01", title: "Exterior rhythm", text: "Fins, screens and layered surfaces can bring depth to an elevation. Consider spacing, viewing distance and how shadows change across the day.", note: "LINE / SCALE / SHADOW" },
  { id: "interior-atmosphere", number: "02", title: "Interior atmosphere", text: "A warm accent, a quiet frame or a reflective plane. Explore how metal sits alongside stone, timber and the lighting of a room.", note: "TEXTURE / TONE / CONTRAST" },
  { id: "sculptural-presence", number: "03", title: "Sculptural presence", text: "A distinct form can create a pause in a larger space. Think about its silhouette, its surroundings and the experience of moving around it.", note: "FORM / BALANCE / VIEWPOINT" },
];

const detailQuestions = [
  { title: "The edge", text: "A sharp visual line or a softer transition? Consider the profile, the thickness it reveals and how the edge will be seen or touched." },
  { title: "The junction", text: "Where two surfaces meet, the gap becomes part of the composition. Bring adjoining materials and connection references into the same drawing." },
  { title: "The finish", text: "Texture direction, sheen and colour all affect the reading of a surface. Review references in the lighting and viewing conditions of the intended space." },
];

export const metadata: Metadata = {
  title: { absolute: "GUOYAO METAL | Architectural Metalworks" },
  description: "Explore architectural metal ideas for facades, interiors and sculptural forms. Discover material, finish and detail considerations with Guoyao Metal.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <MetalMotion className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <Image src="/images/metal/hero-sculpture.webp" alt="Geometric bronze and reflective metal sculpture in a dark architectural setting" fill preload sizes="(max-width: 800px) 1500px, 100vw" className={styles.heroImage} />
        <div className={styles.heroShade} />
        <span className={styles.heroConcept}>CONCEPT VISUAL</span>
        <div className={styles.heroContent}>
          <p className={styles.kickerLight}><span />ARCHITECTURAL METALWORKS</p>
          <h1 id="home-title">Metal, made<br /><em>remarkable.</em></h1>
          <p className={styles.heroDescription}>An exploration of material, light and form.<br />A new expression for the spaces we inhabit.</p>
          <div className={styles.heroActions}>
            <Link href="/case-studies" className={styles.solidButton}>Explore case studies <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <InquiryButton className={styles.lightLink}>Start a conversation <ArrowUpRight size={16} aria-hidden="true" /></InquiryButton>
          </div>
        </div>
        <div className={styles.heroBottom}><a href="#perspective"><ArrowDown size={15} aria-hidden="true" />DISCOVER THE PERSPECTIVE</a><span>GUANGZHOU, CHINA</span></div>
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
            <a href="#exterior-rhythm" className={styles.studyCard} data-metal-reveal>
              <div className={styles.studyImage}><Image src="/images/metal/project-bronze.webp" alt="Concept study of a building facade with rhythmic bronze fins" fill sizes="(min-width: 1460px) 774px, (min-width: 541px) 55vw, calc(100vw - 48px)" /><span>01 / ARCHITECTURAL EXPRESSION</span></div>
              <div className={styles.cardTitle}><h3>Rhythm in architecture</h3><ArrowUpRight size={22} aria-hidden="true" /></div><p>Line, repetition and the changing character of light.</p><span className={styles.conceptLabel}>DESIGN CONCEPT</span>
            </a>
            <a href="#sculptural-presence" className={styles.studyCard} data-metal-reveal>
              <div className={styles.studyImage}><Image src="/images/metal/project-reflective.webp" alt="Concept study of a polished reflective metal form in a stone interior" fill sizes="(min-width: 1460px) 534px, (min-width: 541px) 38vw, calc(100vw - 48px)" /><span>02 / SCULPTURAL FORM</span></div>
              <div className={styles.cardTitle}><h3>A dialogue with space</h3><ArrowUpRight size={22} aria-hidden="true" /></div><p>Soft reflections. A strong sense of form.</p><span className={styles.conceptLabel}>DESIGN CONCEPT</span>
            </a>
          </div>
        </div>
      </section>

      <MaterialExplorer />

      <section className={styles.applications} aria-labelledby="applications-title">
        <div className={styles.container}>
          <div className={styles.sectionHead} data-metal-reveal>
            <div><p className={styles.kicker}>04 / A PLACE FOR METAL</p><h2 id="applications-title">Different spaces.<br /><em>A considered expression.</em></h2></div>
            <p className={styles.sectionDescription}>Start with the experience of a place, then explore the material that could give it character.</p>
          </div>
          <div className={styles.applicationGrid}>
            <div className={styles.applicationList}>
              {applications.map(item => <article id={item.id} key={item.id} className={styles.applicationItem} data-metal-reveal><span className={styles.applicationNumber}>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p><span className={styles.applicationNote}>{item.note}</span></div></article>)}
            </div>
            <figure className={styles.applicationFigure} data-metal-reveal>
              <div className={styles.applicationImage}><Image src="/images/metal/spatial-installation.webp" alt="Concept of flowing bronze ribbons suspended in a tall stone interior" fill sizes="(min-width: 900px) 56vw, 100vw" /><span className={styles.applicationConcept}>DESIGN CONCEPT</span></div>
              <figcaption>FORM IN DIALOGUE WITH SPACE</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.detailSection} aria-labelledby="detail-title">
        <div className={styles.container}>
          <div className={styles.detailGrid}>
            <figure data-metal-reveal><div className={styles.detailImage}><Image src="/images/metal/craft-finishing.webp" alt="Illustrative closeup of a brushed metal corner being hand finished" fill sizes="(min-width: 850px) 50vw, 100vw" /></div><figcaption>ILLUSTRATIVE CRAFT STUDY</figcaption></figure>
            <div className={styles.detailCopy} data-metal-reveal><p className={styles.kicker}>05 / THE DETAIL MATTERS</p><h2 id="detail-title">A closer look.<br /><em>A clearer idea.</em></h2><p>A convincing material expression begins with the small decisions. Explore three useful checkpoints before a design conversation.</p><div className={styles.detailQuestions}>{detailQuestions.map((question, index) => <details key={question.title} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question.title}<Plus size={16} aria-hidden="true" /></summary><p>{question.text}</p></details>)}</div><InquiryButton className={styles.textLink}>Discuss the possibilities <ArrowUpRight size={17} aria-hidden="true" /></InquiryButton></div>
          </div>
        </div>
      </section>

      <section className={styles.journal} aria-labelledby="journal-title">
        <div className={styles.container}>
          <div className={styles.journalGrid} data-metal-reveal><div><p className={styles.kicker}>06 / THE JOURNAL</p><h2 id="journal-title">Thoughts behind<br /><em>the material.</em></h2></div><div><p>A closer reading of texture, connection and light. The small observations that make a material choice more considered.</p><Link href="/blog" className={styles.textLink}>Explore the journal <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
          <div className={styles.journalTopics} aria-label="Material observations">
            <article data-metal-reveal><span>01 / SURFACE</span><h3>Read the grain.</h3><p>The direction of a brushed texture changes how a highlight travels. Look at the surface from more than one angle.</p></article>
            <article data-metal-reveal><span>02 / COMPOSITION</span><h3>Notice the connection.</h3><p>A junction can disappear into a composition or give it definition. Both begin with the relationship between the adjoining parts.</p></article>
            <article data-metal-reveal><span>03 / LIGHT</span><h3>Follow the reflection.</h3><p>A reflective finish takes on its surroundings. Consider what sits opposite it, as well as the surface itself.</p></article>
          </div>
        </div>
      </section>
    </MetalMotion>
  );
}
