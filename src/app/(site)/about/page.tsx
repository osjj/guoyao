import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { InquiryButton } from "@/components/site/inquiry-contact";
import { COMPANY_NAME } from "@/lib/site-identity";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Meet GUOYAO METAL. Explore our perspective on architectural metalwork, how to consider a material in its setting, and what to bring to a project conversation.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    number: "01",
    title: "Intent before labels.",
    description: "Begin with what the element should bring to the architecture. A finish name is more useful when the intended visual effect is clear.",
  },
  {
    number: "02",
    title: "References before assumptions.",
    description: "Drawings, material references and photographs make a design direction easier to discuss. Identify what matters in each reference: its colour, texture, proportion or relationship to the space.",
  },
  {
    number: "03",
    title: "Questions before conclusions.",
    description: "Keep open questions visible. Separate the requirements already defined from the choices still being explored, so the next conversation has a useful starting point.",
  },
];

const materialObservations = [
  {
    number: "01",
    title: "Under the intended light.",
    description: "Look at the reference in the lighting planned for the space. Notice the direction of the highlights, the depth of the tone and what the surface reflects.",
    prompt: "What should stand out, and what should stay quiet?",
  },
  {
    number: "02",
    title: "At an architectural scale.",
    description: "Think beyond the small sample. Consider how the direction of a texture or a repeated element will read across a larger plane, and from the usual viewing distance.",
    prompt: "Is the effect about a close detail or a distant rhythm?",
  },
  {
    number: "03",
    title: "Beside the other materials.",
    description: "Place the metal reference alongside the stone, timber, glass or painted surfaces in the scheme. Compare the overall composition as well as each individual finish.",
    prompt: "Should the metal create contrast or continuity?",
  },
];

const briefItems = [
  {
    number: "01",
    title: "The setting",
    description: "Show where the element belongs. A plan, a site photograph or a short description helps establish its relationship to the surrounding architecture.",
    details: ["Location and intended use", "Interior or exterior setting", "Adjacent materials"],
  },
  {
    number: "02",
    title: "The design direction",
    description: "Share the images or sketches that express your idea. A short note about what you like in each reference is more useful than a collection of unexplained pictures.",
    details: ["Sketches or concept drawings", "Colour and finish references", "The visual effect you want"],
  },
  {
    number: "03",
    title: "The known information",
    description: "Include the information available at this stage, and mark anything still provisional. Early discussions can begin with a concept; more detailed questions need more detailed references.",
    details: ["Indicative dimensions", "Element types and quantities, if known", "Drawing version or design stage"],
  },
  {
    number: "04",
    title: "The questions to resolve",
    description: "Make the priorities explicit. Appearance, touch, maintenance, interfaces and project requirements can each shape the conversation in a different way.",
    details: ["Fixed requirements and open choices", "Questions about the intended finish", "What you need to clarify next"],
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

      <section id="material-perspective" className={`${styles.container} ${styles.materialPerspective}`} aria-labelledby="material-perspective-heading">
        <figure className={styles.detailFigure}>
          <div className={styles.detailImage}>
            <Image
              src="/images/metal/bronze-detail.webp"
              alt="Illustrative close study of a brushed bronze corner and the direction of its surface texture"
              fill
              sizes="(max-width: 760px) calc(100vw - 40px), 41vw"
            />
          </div>
          <figcaption><span>Surface &amp; proportion</span><span>Illustrative detail study</span></figcaption>
        </figure>
        <div className={styles.materialPerspectiveCopy}>
          <p className={styles.kicker}>02 / Reading the material</p>
          <h2 id="material-perspective-heading">Look at the sample.<br /><em>Then at the space.</em></h2>
          <p className={styles.materialIntroduction}>A material choice is also a choice about its setting. These three observations help frame the discussion beyond a finish name.</p>
          <div className={styles.observationList}>
            {materialObservations.map((item) => (
              <article className={styles.observation} key={item.number}>
                <span className={styles.observationNumber}>{item.number}</span>
                <div><h3>{item.title}</h3><p>{item.description}</p><p className={styles.observationPrompt}>{item.prompt}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.principles} aria-labelledby="principles-heading">
        <div className={`${styles.container} ${styles.principlesInner}`}>
          <div className={styles.principlesHeading}>
            <p className={styles.kicker}>03 / What guides the conversation</p>
            <h2 id="principles-heading">Clarity<br />before<br /><em>decisions.</em></h2>
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

      <section id="project-conversation" className={`${styles.container} ${styles.projectConversation}`} aria-labelledby="conversation-heading">
        <div className={styles.conversationHeading}>
          <div>
            <p className={styles.kicker}>04 / Preparing the first conversation</p>
            <h2 id="conversation-heading">A project starts<br /><em>with a shared brief.</em></h2>
          </div>
          <p>The more clearly an idea is described, the more useful the conversation becomes. Bring the context, the references and the questions that matter to your project.</p>
        </div>
        <figure className={styles.processFigure}>
          <div className={styles.processImage}>
            <Image
              src="/images/metal/process-table.webp"
              alt="Illustrative design study with an architectural sketch, a small metal model and material references"
              fill
              sizes="(max-width: 1600px) 90vw, 1440px"
            />
          </div>
          <figcaption><span>From a reference to a discussion</span><span>Illustrative design study</span></figcaption>
        </figure>
        <div className={styles.briefGrid}>
          {briefItems.map((item) => (
            <article className={styles.briefItem} key={item.number}>
              <span className={styles.briefNumber}>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul aria-label={`Useful references for ${item.title.toLowerCase()}`}>
                {item.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className={styles.startConversation}>
          <div><h3>Bring what you have.</h3><p>A complete brief is not required to begin. Share your current references and tell us which decisions are still open.</p></div>
          <InquiryButton className={styles.button}>Start the conversation <ArrowUpRight size={20} aria-hidden="true" /></InquiryButton>
        </div>
      </section>
    </div>
  );
}
