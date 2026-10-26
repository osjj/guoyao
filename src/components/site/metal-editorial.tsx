import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { InquiryButton } from "./inquiry-contact";
import styles from "./metal-editorial.module.css";

export async function loadEditorialContent<T>(request: Promise<T>): Promise<T> {
  let deadline: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      request,
      new Promise<never>((_, reject) => {
        deadline = setTimeout(() => reject(new Error("Editorial content request timed out")), 4000);
      }),
    ]);
  } finally {
    if (deadline) clearTimeout(deadline);
  }
}

export function EditorialIntro({ label, title, description, note }: {
  label: string; title: ReactNode; description: string; note: string;
}) {
  return <header className={`${styles.container} ${styles.intro}`}>
    <div><p className={styles.eyebrow}>{label}</p><h1>{title}</h1></div>
    <div className={styles.introAside}><p>{description}</p><span>{note}</span></div>
  </header>;
}

export function EditorialImage({ src, alt, caption, className = "" }: {
  src: string; alt: string; caption: string; className?: string;
}) {
  return <figure className={`${styles.container} ${styles.editorialFigure} ${className}`}>
    <div className={styles.panorama}><Image src={src} alt={alt} fill preload sizes="(min-width: 1600px) 1440px, 92vw" /></div>
    <figcaption><span>GUOYAO METAL / MATERIAL & SPACE</span><span>{caption}</span></figcaption>
  </figure>;
}

export function ContentState({ unavailable = false, type }: { unavailable?: boolean; type: "articles" | "projects" }) {
  return <div className={styles.emptyState} role={unavailable ? "status" : undefined}>
    <span className={styles.emptyMark} aria-hidden="true">{unavailable ? "—" : "01"}</span>
    <div><p className={styles.eyebrow}>{unavailable ? "Please check back" : "A new chapter"}</p>
      <h3>{unavailable ? `Our ${type === "articles" ? "journal" : "project archive"} is temporarily unavailable.` : type === "articles" ? "New perspectives are taking shape." : "Our project archive is taking shape."}</h3>
      <p>{unavailable ? "Please try again shortly. You can also start a conversation with our team." : type === "articles" ? "Notes on architectural metal, surface finishes and the details that bring a space together will appear here." : "Published project stories will appear here, with the brief, material choices and details behind each space."}</p>
      <InquiryButton className={styles.textLink}>Start a conversation<ArrowUpRight size={18} aria-hidden="true" /></InquiryButton>
    </div>
  </div>;
}

export function EditorialCta({ title = "Give your next space a material direction.", description = "Share your drawings, ideas or material brief. Let's explore the details together." }: {
  title?: string; description?: string;
}) {
  return <section className={styles.cta}>
    <div className={`${styles.container} ${styles.ctaInner}`}>
      <div><p className={styles.eyebrow}>A conversation starts here</p><h2>{title}</h2><p>{description}</p></div>
      <InquiryButton className={styles.ctaButton}>Discuss your project<ArrowUpRight size={20} aria-hidden="true" /></InquiryButton>
    </div>
  </section>;
}

export function DetailUnavailable({ type }: { type: "article" | "project" }) {
  return <div className={styles.page}>
    <div className={`${styles.container} ${styles.unavailable}`}>
      <p className={styles.eyebrow}>Temporarily unavailable</p>
      <h1>We couldn&apos;t load this {type}.</h1>
      <p>Please try again shortly.</p>
      <Link className={styles.textLink} href={type === "article" ? "/blog" : "/case-studies"}>Back to {type === "article" ? "the journal" : "case studies"}<ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
  </div>;
}
