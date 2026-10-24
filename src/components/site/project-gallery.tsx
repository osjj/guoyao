"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./project-gallery.module.css";

export type ProjectGalleryItem = {
  src: string;
  title: string;
  category: "retail" | "cladding" | "stairs" | "displays" | "workshop";
  stage: string;
  alt: string;
  format?: "wide" | "portrait" | "standard";
  aspectRatio?: number;
};

const categories = [
  { value: "all", label: "All work" },
  { value: "retail", label: "Retail" },
  { value: "cladding", label: "Architectural cladding" },
  { value: "stairs", label: "Stairs & rails" },
  { value: "displays", label: "Displays" },
  { value: "workshop", label: "In the workshop" },
] as const;

type Category = (typeof categories)[number]["value"];

export function ProjectGallery({ items }: { items: readonly ProjectGalleryItem[] }) {
  const [category, setCategory] = useState<Category>("all");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const id = useId();
  const filtered = category === "all" ? items : items.filter(item => category === "workshop" ? item.category === "workshop" || /workshop|packing/i.test(item.stage) : item.category === category);
  const visible = expanded ? filtered : filtered.slice(0, 8);
  const spreads = Array.from({ length: Math.ceil(visible.length / 4) }, (_, index) => visible.slice(index * 4, index * 4 + 4));

  function filter(value: Category) {
    setCategory(value);
    setExpanded(false);
    setSelected(null);
  }

  function photograph(item: ProjectGalleryItem, index: number, slot?: number) {
    const format = item.format ?? "standard";
    const sizes = category === "all" && format === "wide"
      ? "(min-width: 1500px) 920px, (min-width: 761px) 66vw, calc(100vw - 40px)"
      : "(min-width: 1500px) 640px, (min-width: 761px) 44vw, calc(100vw - 40px)";

    return (
      <figure key={item.src} className={`${styles.card} ${styles[format]}`} data-slot={slot}>
        <button type="button" className={styles.imageButton} aria-label={`Enlarge ${item.title}, ${item.stage}`} onClick={() => setSelected(index)}>
          <span className={styles.image} style={category === "all" && format === "wide" && item.aspectRatio ? { aspectRatio: item.aspectRatio } : undefined}>
            <Image src={item.src} alt={item.alt} fill sizes={sizes} />
            <span className={styles.enlarge} aria-hidden="true"><ArrowUpRight size={19} /></span>
          </span>
        </button>
        <figcaption><h3>{item.title}</h3><p>{item.stage}</p></figcaption>
      </figure>
    );
  }

  return (
    <section className={styles.section} id="project-gallery" aria-labelledby={`${id}-title`}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div><p className={styles.kicker}>03 / PROJECT GALLERY</p><h2 id={`${id}-title`}>The project <em>collection.</em></h2></div>
          <p className={styles.intro}>Installed spaces, workshop assemblies and the details between them. Explore the photographs up close.</p>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.filters} role="group" aria-label="Filter project photographs">
            {categories.map(item => <button key={item.value} type="button" aria-pressed={category === item.value} aria-controls={`${id}-grid`} onClick={() => filter(item.value)}>{item.label}</button>)}
          </div>
          <p className={styles.count} aria-live="polite">{visible.length} / {filtered.length} <span>PHOTOGRAPHS</span></p>
        </div>
        {visible.length ? <div className={category === "all" ? styles.spreads : styles.regularGrid} id={`${id}-grid`}>
          {category === "all"
            ? spreads.map((spread, spreadIndex) => <div className={styles.spread} key={spread[0].src}>{spread.map((item, slot) => photograph(item, spreadIndex * 4 + slot, slot))}</div>)
            : visible.map((item, index) => photograph(item, index))}
        </div> : <p className={styles.empty} id={`${id}-grid`}>No photographs in this category yet. Choose another view to keep exploring.</p>}
        {!expanded && filtered.length > 8 && <div className={styles.moreRow}><span>There is more to the story.</span><button type="button" className={styles.moreButton} onClick={() => setExpanded(true)}>View all {filtered.length} photographs <Plus size={17} aria-hidden="true" /></button></div>}
      </div>
      {selected !== null && filtered[selected] && <GalleryLightbox items={filtered} initialIndex={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function GalleryLightbox({ items, initialIndex, onClose }: { items: readonly ProjectGalleryItem[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const [loaded, setLoaded] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const currentIndex = items.length ? index % items.length : 0;
  const item = items[currentIndex];

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  function move(direction: number) {
    if (items.length) setIndex(current => ((current % items.length) + direction + items.length) % items.length);
  }

  if (!item) return null;

  return (
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    }}>
      <div className={styles.lightbox}>
        <div className={styles.lightboxTop}><span>GUOYAO METAL / PROJECT ARCHIVE</span><button type="button" className={styles.close} aria-label="Close photograph" onClick={onClose} autoFocus><X size={23} aria-hidden="true" /></button></div>
        <div className={styles.lightboxImage} aria-busy={loaded !== item.src}>
          {loaded !== item.src && <span className={styles.loading} role="status">Loading photograph…</span>}
          <Image key={item.src} src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 90vw" loading="eager" onLoad={() => setLoaded(item.src)} />
          {items.length > 1 && <><button type="button" className={`${styles.imageNav} ${styles.previous}`} aria-label="Previous photograph" onClick={() => move(-1)}><ArrowLeft size={22} aria-hidden="true" /></button><button type="button" className={`${styles.imageNav} ${styles.next}`} aria-label="Next photograph" onClick={() => move(1)}><ArrowRight size={22} aria-hidden="true" /></button></>}
        </div>
        <div className={styles.lightboxCaption}><div><h3 id={titleId}>{item.title}</h3><p>{item.stage}</p></div><p className={styles.position} aria-live="polite">{String(currentIndex + 1).padStart(2, "0")} <span>/ {String(items.length).padStart(2, "0")}</span></p></div>
      </div>
    </dialog>
  );
}
