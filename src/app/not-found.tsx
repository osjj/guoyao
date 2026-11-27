import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import mirror from "@/components/site/home-styles/style-10-liquid.module.css";
import styles from "@/components/site/alloy-subpages.module.css";

const destinations = [
  { href: "/", label: "Home" },
  { href: "/case-studies", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export default function NotFoundPage() {
  return (
    <main className={`${styles.page} ${styles.notFoundShell}`}>
      <header className={styles.notFoundTop}>
        <div className={mirror.headerInner}>
          <Link href="/" className={mirror.brand} aria-label="Guoyao Metal, home">
            <span className={mirror.brandOrb} aria-hidden="true" />
            <span>GUOYAO</span>
            <span className={mirror.brandSub}>METAL</span>
          </Link>
          <span className={mirror.statusChip}>
            <span className={mirror.liveDot} aria-hidden="true" />
            404 · Page Not Found
          </span>
        </div>
      </header>

      <div className={styles.notFoundMain}>
        <div className={`${mirror.container} ${styles.notFoundGrid}`}>
          <div>
            <p className={mirror.eyebrow}>An Unexpected Turn · 404</p>
            <h1 className={styles.subHeroTitle}>
              <span className={mirror.chromeText}>This page is</span>
              <span className={mirror.heroItalic}>out of view.</span>
            </h1>
            <p className={styles.subHeroLead}>
              We couldn&apos;t find the page at this address. Continue exploring Guoyao Metal&apos;s
              architectural metalwork, documented case studies, and technical journal below.
            </p>
            <div className={mirror.heroActions}>
              <Link href="/" className={mirror.moltenCtaLg}>
                Return to Home <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/case-studies" className={mirror.outlineCta}>
                Explore Case Studies <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <nav aria-label="Continue exploring" className={styles.destCard}>
            <p className={styles.destCardTitle}>Continue Exploring</p>
            {destinations.map((destination, index) => (
              <Link key={destination.href} href={destination.href} className={styles.destLink}>
                <span className={styles.destNum}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.destLabel}>{destination.label}</span>
                <span className={styles.destHint} aria-hidden="true">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <footer className={styles.notFoundFoot}>
        <div className={`${mirror.container} ${styles.notFoundFootInner}`}>
          <span>GUOYAO METAL</span>
          <span>ARCHITECTURAL METALWORKS · GUANGZHOU</span>
        </div>
      </footer>
    </main>
  );
}
