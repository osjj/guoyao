import { ArrowUpRight } from "lucide-react";
import { InquiryButton } from "./inquiry-contact";
import mirror from "./home-styles/style-10-liquid.module.css";
import styles from "./alloy-subpages.module.css";

export function ArchiveState({
  type,
  unavailable = false,
}: {
  type: "articles" | "projects";
  unavailable?: boolean;
}) {
  return (
    <div className={styles.stateCard} role={unavailable ? "status" : undefined}>
      <p className={mirror.eyebrow}>{unavailable ? "Please check back" : "A new chapter"}</p>
      <h2>
        {unavailable
          ? `Our ${type === "articles" ? "journal" : "project archive"} is temporarily unavailable.`
          : type === "articles"
            ? "New perspectives are taking shape."
            : "Our project archive is taking shape."}
      </h2>
      <p>
        {unavailable
          ? "Please try again shortly. You can also start a conversation with our Guangzhou engineering team."
          : "We’ll publish new architectural metalwork records and technical stories here as they are released."}
      </p>
      <div className={styles.stateActions}>
        <InquiryButton className={mirror.moltenCta}>
          Start a conversation <ArrowUpRight size={15} aria-hidden="true" />
        </InquiryButton>
      </div>
    </div>
  );
}
