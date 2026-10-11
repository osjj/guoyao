import Image from "next/image";
import Link from "next/link";
import styles from "./metal-shell.module.css";

export function Logo({ variant = "blue", compact = false }: { variant?: "blue" | "white"; compact?: boolean }) {
  return (
    <Link href="/" className={`${styles.logo} ${variant === "white" ? styles.logoLight : ""} ${compact ? styles.logoCompact : ""}`} aria-label="Guoyao Metal home">
      <span className={styles.logoMark} aria-hidden="true">
        <Image src="/brand/guoyao-logo-source.png" alt="" width={1254} height={1254} sizes="128px" loading="eager" />
      </span>
      <span className={styles.logoWords}><strong>GUOYAO METAL</strong><span>ARCHITECTURAL METALWORKS</span></span>
    </Link>
  );
}
