import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { InquiryButton } from "@/components/site/inquiry-contact";
import { COMPANY_NAME } from "@/lib/site-identity";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Meet GUOYAO METAL. A material-focused perspective on architectural metalwork, form, surface and the details that shape a space.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    number: "01",
    title: "Begin with the space.",
    description: "A metal detail belongs to a larger story. Its proportions, placement and relationship to the architecture give it purpose.",
  },
  {
    number: "02",
    title: "Let the material speak.",
    description: "Brushed or reflective. Quiet or expressive. A surface changes how light moves, and how a space feels.",
  },
  {
    number: "03",
    title: "Resolve the detail.",
    description: "Edges, transitions and connections deserve the same consideration as the overall form. The smallest decisions shape the whole.",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <section className={`${styles.container} ${styles.intro}`} aria-labelledby="about-heading">
        <div className={styles.introCopy}>
          <p className={styles.kicker}>About GUOYAO METAL</p>
          <h1 id="about-heading">A material.<br />A <em>point of view.</em></h1>
          <p className={styles.introText}>Metal has a presence all its own.<br className={styles.desktopBreak} /> We explore what it can bring to a space.</p>
          <a href="#our-perspective" className={styles.textLink}>Discover our perspective <span aria-hidden="true">↓</span></a>
        </div>
        <figure className={styles.introFigure}>
          <div className={styles.introImage}>
            <Image
              src="/images/metal/project-reflective.webp"
              alt="Design concept of a reflective metal sculpture in a light stone interior"
              fill
              preload
              sizes="(max-width: 760px) calc(100vw - 40px), 43vw"
            />
          </div>
          <figcaption><span>Form / Reflection / Space</span><span>Design concept</span></figcaption>
        </figure>
      </section>

      <section id="our-perspective" className={`${styles.container} ${styles.perspective}`} aria-labelledby="perspective-heading">
        <div className={styles.sectionLabel}><span className={styles.kicker}>01 / Our perspective</span><span className={styles.shortRule} aria-hidden="true" /></div>
        <div className={styles.perspectiveBody}>
          <h2 id="perspective-heading">Where material meets<br /><em>architectural intent.</em></h2>
          <div className={styles.perspectiveText}>
            <p>GUOYAO METAL is a brand of <span lang="zh-CN">{COMPANY_NAME}</span>. Our focus is architectural metalwork: the forms, finishes and details that give a place its character.</p>
            <p>We approach the conversation through the design itself. What should a surface express? How does it meet the surrounding materials? What happens when the light changes? These questions are the starting point.</p>
          </div>
          <div className={styles.companyLine}><span>Company name</span><p lang="zh-CN">{COMPANY_NAME}</p><span>Guangzhou, China</span></div>
        </div>
      </section>

      <figure className={styles.materialFigure}>
        <div className={styles.materialImage}>
          <Image
            src="/images/metal/material-study.webp"
            alt="Illustrative study of brushed bronze tones, satin metal and reflective metal surfaces"
            fill
            sizes="100vw"
          />
          <p className={styles.materialWords}>Texture.<br />Reflection.<br /><em>Character.</em></p>
        </div>
        <figcaption className={styles.container}><span>A study in surface and light</span><span>Illustrative material study</span></figcaption>
      </figure>

      <section className={styles.principles} aria-labelledby="principles-heading">
        <div className={`${styles.container} ${styles.principlesInner}`}>
          <div className={styles.principlesHeading}>
            <p className={styles.kicker}>02 / What guides us</p>
            <h2 id="principles-heading">The detail<br />defines<br /><em>the whole.</em></h2>
          </div>
          <div className={styles.principleList}>
            {principles.map((principle) => (
              <article className={styles.principle} key={principle.number}>
                <span className={styles.principleNumber}>{principle.number}</span>
                <div><h3>{principle.title}</h3><p>{principle.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.container} ${styles.conversation}`} aria-labelledby="conversation-heading">
        <p className={styles.kicker}>03 / A conversation starts here</p>
        <div className={styles.conversationRow}>
          <h2 id="conversation-heading">An idea in mind?<br /><em>Let&apos;s give it form.</em></h2>
          <div className={styles.conversationCopy}>
            <p>A sketch, a reference, a material direction. Share what you are considering, and let&apos;s discuss the details that matter to your project.</p>
            <InquiryButton className={styles.button}>Discuss a project <ArrowUpRight size={20} aria-hidden="true" /></InquiryButton>
            <Link href="/case-studies" className={styles.textLink}>Explore case studies <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
