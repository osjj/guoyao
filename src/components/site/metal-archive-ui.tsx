import { ArrowUpRight } from "lucide-react";
import { InquiryButton } from "./inquiry-contact";
import styles from "./metal-archives.module.css";

export function ArchiveState({ type, unavailable = false }: { type: "articles" | "projects"; unavailable?: boolean }) {
  return <div className={styles.archiveState} role={unavailable ? "status" : undefined}>
    <p className={styles.eyebrow}>{unavailable ? "Please check back" : "A new chapter"}</p>
    <h2>{unavailable ? `Our ${type === "articles" ? "journal" : "project archive"} is temporarily unavailable.` : type === "articles" ? "New perspectives are taking shape." : "Our project archive is taking shape."}</h2>
    <p>{unavailable ? "Please try again shortly. You can also start a conversation with our team." : "We’ll share new stories here as they are published."}</p>
    <InquiryButton className={styles.quietLink}>Start a conversation<ArrowUpRight size={17} aria-hidden="true" /></InquiryButton>
  </div>;
}

