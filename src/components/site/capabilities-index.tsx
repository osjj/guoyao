import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CAPABILITIES, CAPABILITIES_OVERVIEW, capabilityPath } from "@/data/capabilities";
import { InquiryButton } from "./inquiry-contact";
import alloy from "./alloy-subpages.module.css";
import styles from "./capabilities.module.css";

const overview = CAPABILITIES_OVERVIEW;
const finishNotes = [
  { title: "Directional satin", detail: "Set the brush direction on the elevation and check it across curved panels and dressed seams." },
  { title: "Mirror polish", detail: "Inspect a formed sample from real viewing positions. Reflections reveal distortion that a flat swatch can hide." },
  { title: "Textured and coloured metal", detail: "Compare hammered brass, fluted profiles and PVD colour on formed samples under the specified lighting." },
];

export function CapabilitiesIndex() {
  return (
    <div className={`${alloy.page} ${styles.page}`}>
      <header className={`${styles.wrap} ${styles.hero} ${styles.overviewHero}`}>
        <div className={styles.heroCopy}>
          <p className={styles.label}>Fabrication capabilities</p>
          <h1>{overview.h1}</h1>
          <p className={styles.lead}>{overview.lead}</p>
          <div className={styles.actions}>
            <Link className={styles.outline} href="#fabrication-capabilities">Explore the capabilities</Link>
            <InquiryButton className={styles.action} product={{ name: overview.inquiryProductName }}>
              Discuss your project <ArrowUpRight size={17} aria-hidden="true" />
            </InquiryButton>
          </div>
        </div>
        <figure className={styles.heroFigure}>
          <Image
            src={overview.heroImage.src}
            alt={overview.heroImage.alt}
            width={overview.heroImage.width}
            height={overview.heroImage.height}
            sizes="(max-width: 800px) 92vw, 45vw"
            preload
          />
          <figcaption>{overview.heroImage.caption}</figcaption>
        </figure>
      </header>

      <section className={`${styles.wrap} ${styles.section}`} id="fabrication-capabilities" aria-labelledby="fabrication-capabilities-heading">
        <h2 id="fabrication-capabilities-heading">What we fabricate</h2>
        <div className={styles.indexGrid}>
          {CAPABILITIES.map((capability) => (
            <Link className={styles.indexCard} key={capability.slug} href={capabilityPath(capability.slug)}>
              <Image
                src={capability.heroImage.src}
                alt={capability.heroImage.alt}
                width={capability.heroImage.width}
                height={capability.heroImage.height}
                sizes="(max-width: 650px) 92vw, 45vw"
              />
              <div className={styles.cardBody}>
                <div className={styles.cardTitle}>
                  <h3>{capability.navTitle}</h3><ArrowUpRight size={20} aria-hidden="true" />
                </div>
                <p>{capability.lead}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="choose-a-finish">
        <h2 id="choose-a-finish">Choose a finish at project scale</h2>
        <ul className={styles.notes}>
          {finishNotes.map(({ title, detail }) => (
            <li key={title}><h3>{title}</h3><p>{detail}</p></li>
          ))}
        </ul>
      </section>

      <section className={`${styles.wrap} ${styles.section} ${styles.process}`} aria-labelledby="workshop-and-dispatch">
        <h2 id="workshop-and-dispatch">From workshop fit to dispatch</h2>
        <ol className={styles.notes}>
          <li><h3>Agree the interfaces</h3><p>Identify the supports, services, finish boundaries and site dimensions on the drawings before dividing the assembly into pieces.</p></li>
          <li><h3>Review the 1:1 trial</h3><p>Agree which bay, run or transition to assemble at full scale. Check the junctions, service access and visible surfaces with the trial in its working position.</p></li>
          <li><h3>Plan the crates</h3><p>Set package limits against the access route and lifting plan. Use the assembly sequence to agree piece labels, surface protection and crate contents.</p></li>
        </ol>
        <InquiryButton className={styles.action} product={{ name: overview.inquiryProductName }}>
          Discuss your fabrication brief <ArrowUpRight size={17} aria-hidden="true" />
        </InquiryButton>
      </section>
    </div>
  );
}
