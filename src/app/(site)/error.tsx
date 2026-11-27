"use client";

import Link from "next/link";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import styles from "@/components/site/metal-editorial.module.css";

export default function SiteError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className={styles.page}>
      <div className={`${styles.container} ${styles.unavailable}`} role="alert">
        <div className={styles.unavailableCard}>
          <p className={styles.eyebrow}>Temporarily unavailable</p>
          <h1>
            We couldn&apos;t load <span className={styles.displayItalic}>this page.</span>
          </h1>
          <p>
            A temporary interruption prevented this section from loading. Please try again in a
            moment or return to the homepage.
          </p>
          <div className={styles.unavailableActions}>
            <button type="button" className={styles.moltenCta} onClick={retry}>
              <RotateCcw size={15} aria-hidden="true" />
              Try again
            </button>
            <Link href="/" className={styles.outlineBtn}>
              Back to home <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
