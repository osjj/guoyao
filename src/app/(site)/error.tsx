"use client";

import Link from "next/link";
import styles from "@/components/site/metal-editorial.module.css";

export default function SiteError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <div className={styles.page}>
    <div className={`${styles.container} ${styles.unavailable}`} role="alert">
      <p className={styles.eyebrow}>Temporarily unavailable</p>
      <h1>We couldn&apos;t load this page.</h1>
      <p>Please try again in a moment.</p>
      <button type="button" className={styles.textLink} onClick={retry}>Try again</button>
      <p><Link href="/" className={styles.textLink}>Back to home</Link></p>
    </div>
  </div>;
}
