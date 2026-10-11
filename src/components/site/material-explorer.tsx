"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { InquiryButton } from "./inquiry-contact";
import styles from "./material-explorer.module.css";

const studies = [
  { name: "Warm & brushed", number: "01", title: "The warmth of a surface.", text: "Directional texture, quiet highlights and a warm tonal palette. A study in how a material can bring intimacy to a space.", image: "/images/metal/material-study.webp", alt: "Illustrative composition of metal finish samples", tone: "#ac8655" },
  { name: "Reflective & fluid", number: "02", title: "An ever-changing reflection.", text: "A surface that borrows its colour from the world around it. Reflections introduce movement, depth and unexpected viewpoints.", image: "/images/metal/project-reflective.webp", alt: "Reflective metal sculpture design concept in a stone interior", tone: "#bbbdbb" },
  { name: "Rhythm & shadow", number: "03", title: "A rhythm written in light.", text: "Repeating lines create a measured architectural rhythm. Light and shadow make the same surface feel different throughout the day.", image: "/images/metal/project-bronze.webp", alt: "Bronze facade design concept with repeated vertical fins", tone: "#655c43" },
];

export function MaterialExplorer() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const study = studies[selected];
  return (
    <section className={styles.section} aria-labelledby="material-title">
      <div className={styles.inner}>
        <div className={styles.heading}><p>03 / MATERIAL EXPLORATIONS</p><h2 id="material-title">Same material.<br /><em>Different possibilities.</em></h2><span>A visual exploration of texture, reflection and rhythm.</span></div>
        <div className={styles.explorer}>
          <div className={styles.tabs} role="tablist" aria-label="Material perspectives">
            {studies.map((item, index) => <button key={item.name} ref={node => { buttons.current[index] = node; }} id={`material-tab-${index}`} role="tab" type="button" tabIndex={selected === index ? 0 : -1} aria-selected={selected === index} aria-controls="material-panel" onClick={() => setSelected(index)} onKeyDown={event => {
              let next = index;
              if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % studies.length;
              else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + studies.length - 1) % studies.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = studies.length - 1;
              else return;
              event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
            }}><i style={{ backgroundColor: item.tone }} /><span>{item.name}</span><small>{item.number}</small></button>)}
          </div>
          <div id="material-panel" role="tabpanel" aria-labelledby={`material-tab-${selected}`} tabIndex={0} className={styles.panel}>
            <div className={styles.image}><Image key={study.image} src={study.image} alt={study.alt} fill sizes="(min-width: 850px) 62vw, 100vw" /><span>ILLUSTRATIVE DESIGN STUDY</span></div>
            <div className={styles.caption}><div><h3>{study.title}</h3><p>{study.text}</p></div><InquiryButton className={styles.link}>Explore an idea <ArrowUpRight size={17} aria-hidden="true" /></InquiryButton></div>
          </div>
        </div>
      </div>
    </section>
  );
}
