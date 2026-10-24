"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { InquiryButton } from "./inquiry-contact";
import styles from "./material-explorer.module.css";

const studies = [
  { name: "Curved surfaces", number: "01", detail: "FORM & JUNCTION", title: "Form, across every section.", text: "Curved column cladding during workshop pre-assembly. A closer view of the surface, the panel edges and the junctions between sections.", image: "/images/home-projects/column-detail.webp", alt: "Close view of the surface and joints between curved column cladding panels during workshop assembly", stage: "WORKSHOP PRE-ASSEMBLY", position: "50% 42%" },
  { name: "Continuous lines", number: "02", detail: "CURVE & PROFILE", title: "The line, from end to end.", text: "Curved handrail sections in workshop pre-assembly. A closer view of the turning profiles, curved ends and the relationship between the sections.", image: "/images/home-projects/handrail-detail.webp", alt: "Curved handrail sections with turned end details during workshop pre-assembly", stage: "WORKSHOP PRE-ASSEMBLY", position: "50% 50%" },
  { name: "Display details", number: "03", detail: "SURFACE & PROFILE", title: "A presence in the room.", text: "A curved display counter in the workshop. Repeated lines, a rounded profile and contrasting surfaces give the finished component its character.", image: "/images/home-projects/display-counter.webp", alt: "Curved metal display counter with a ribbed front photographed in the workshop", stage: "WORKSHOP VIEW", position: "50% 55%" },
];

const desktopQuery = "(min-width: 901px)";
function subscribeLayout(onChange: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getDesktopLayout = () => window.matchMedia(desktopQuery).matches;
const getServerLayout = () => true;

export function MaterialExplorer() {
  const [selected, setSelected] = useState(0);
  const isDesktop = useSyncExternalStore(subscribeLayout, getDesktopLayout, getServerLayout);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const study = studies[selected];
  return (
    <section className={styles.section} aria-labelledby="material-title">
      <div className={styles.inner}>
        <div className={styles.heading}><p>04 / MATERIAL &amp; DETAIL</p><h2 id="material-title">A closer look.<br /><em>At what matters.</em></h2><span>Real components. Actual workshop views. Details worth a second look.</span></div>
        <div className={styles.explorer}>
          <div className={styles.tabs} role="tablist" aria-label="Metalwork details" aria-orientation={isDesktop ? "vertical" : "horizontal"}>
            {studies.map((item, index) => <button key={item.name} ref={node => { buttons.current[index] = node; }} id={`material-tab-${index}`} role="tab" type="button" tabIndex={selected === index ? 0 : -1} aria-selected={selected === index} aria-controls="material-panel" onClick={() => setSelected(index)} onKeyDown={event => {
              let next = index;
              if (event.key === (isDesktop ? "ArrowDown" : "ArrowRight")) next = (index + 1) % studies.length;
              else if (event.key === (isDesktop ? "ArrowUp" : "ArrowLeft")) next = (index + studies.length - 1) % studies.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = studies.length - 1;
              else return;
              event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
            }}><span className={styles.tabNumber} aria-hidden="true">{item.number}</span><span className={styles.tabCopy}><span>{item.name}</span><small>{item.detail}</small></span><ArrowUpRight size={17} aria-hidden="true" /></button>)}
          </div>
          <div id="material-panel" role="tabpanel" aria-labelledby={`material-tab-${selected}`} tabIndex={0} className={styles.panel}>
            <div className={styles.image}><Image key={study.image} src={study.image} alt={study.alt} fill sizes="(min-width: 1460px) 915px, (min-width: 901px) 62vw, calc(100vw - 48px)" style={{ objectPosition: study.position }} /><span>{study.stage}</span></div>
            <div className={styles.caption}><div><h3>{study.title}</h3><p>{study.text}</p></div><InquiryButton className={styles.link}>Discuss a detail <ArrowUpRight size={17} aria-hidden="true" /></InquiryButton></div>
          </div>
        </div>
      </div>
    </section>
  );
}
