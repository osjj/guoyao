"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { InquiryButton } from "@/components/site/inquiry-contact";
import {
  BRIEF_CHECKLIST,
  DISCIPLINES,
  PROCESS_STEPS,
  REDESIGN_NAV,
  WORKSHOP_TO_SITE_PAIRS,
  projectBrands,
  projectRecords,
} from "@/data/homepage-redesign-data";
import { COMPANY_NAME, SALES_EMAIL, SALES_TELEPHONES } from "@/lib/site-identity";
import styles from "./style-4-foundry.module.css";

type RegionFilter = "All" | "Mainland China" | "HK & Macau" | "International";

function classifyRegion(location: string): Exclude<RegionFilter, "All"> {
  if (location === "Hong Kong" || location === "Macau") return "HK & Macau";
  if (location === "United States" || location === "Australia" || location === "Delhi") {
    return "International";
  }
  return "Mainland China";
}

export function Style4Foundry() {
  const [pairIdx, setPairIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"installed" | "workshop">("installed");
  const [scopeIdx, setScopeIdx] = useState(0);
  const [region, setRegion] = useState<RegionFilter>("All");
  const [menuOpen, setMenuOpen] = useState(false);

  const pair = WORKSHOP_TO_SITE_PAIRS[pairIdx];
  const activePhoto = viewMode === "installed" ? pair.installed : pair.workshop;
  const activeScope = DISCIPLINES[scopeIdx];

  const filteredRecords =
    region === "All"
      ? projectRecords
      : projectRecords.filter((rec) => classifyRegion(rec.location) === region);

  return (
    <div className={styles.page} data-redesign-home="style-4">
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandGroup}>
            <Link href="/" className={styles.brandLink}>
              <Image src="/brand/guoyao-logo-source.png" alt="" width={32} height={32} />
              <strong>GUOYAO METAL</strong>
            </Link>
            <span className={styles.coordChip}>GZ-CN // 23.12°N 113.26°E</span>
          </div>

          <nav className={styles.nav} aria-label="Primary navigation">
            {REDESIGN_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <InquiryButton className={styles.rfqBtn}>
            Submit Drawings <ArrowUpRight size={15} aria-hidden="true" />
          </InquiryButton>

          <button
            type="button"
            className={styles.mobileToggle}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {menuOpen && (
          <nav className={styles.mobileDrawer} aria-label="Mobile navigation">
            {REDESIGN_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <InquiryButton className={styles.rfqBtn}>
              Submit Drawings <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
          </nav>
        )}
      </header>

      {/* Engineering Hero with Live Installed <-> Workshop Pre-Assembly Toggle */}
      <section className={styles.hero} aria-labelledby="foundry-hero-title">
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <div className={styles.techBadge}>SPEC-DRIVEN ARCHITECTURAL FABRICATION</div>
            <h1 id="foundry-hero-title" className={styles.heroTitle}>
              Engineered in Guangzhou.<br />
              Pre-assembled 1:1.<br />
              Built to fit on site.
            </h1>
            <p className={styles.heroLead}>
              Complex architectural metalwork fails when geometry is left to guesswork. Guoyao Metal builds
              steel substructures, compound-curved cladding, and luxury retail facades verified through full
              workshop trial assembly prior to export crating.
            </p>
            <div className={styles.heroMetrics}>
              <div className={styles.metricCard}>
                <span>Trial Assembly</span>
                <strong>Full-Scale 1:1</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Portfolio Span</span>
                <strong>2016–2026</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Dispatch</span>
                <strong>Global Crating</strong>
              </div>
            </div>
            <div className={styles.heroActions}>
              <InquiryButton className={styles.rfqBtn}>
                Upload / Discuss Brief <ArrowUpRight size={15} aria-hidden="true" />
              </InquiryButton>
              <Link href="/case-studies" className={styles.outlineLightBtn}>
                Technical Case Studies <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.compareCard}>
            <div className={styles.compareTop}>
              <div>
                <div style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: "0.68rem", color: "#f29a72", letterSpacing: "0.14em" }}>
                  FABRICATION PROOF TOGGLE
                </div>
                <strong style={{ fontSize: "0.96rem" }}>{pair.label}</strong>
              </div>

              <div className={styles.modeSwitch} role="group" aria-label="Toggle installed and workshop views">
                <button
                  type="button"
                  className={`${styles.modeBtn} ${viewMode === "installed" ? styles.modeBtnActive : ""}`}
                  onClick={() => setViewMode("installed")}
                >
                  Installed
                </button>
                <button
                  type="button"
                  className={`${styles.modeBtn} ${viewMode === "workshop" ? styles.modeBtnActive : ""}`}
                  onClick={() => setViewMode("workshop")}
                >
                  Workshop 1:1
                </button>
              </div>
            </div>

            <div className={styles.compareViewport}>
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                priority
                sizes="(max-width: 1120px) 100vw, 54vw"
              />
              <span className={styles.compareStatus}>
                {viewMode === "installed" ? "SITE / INSTALLED VIEW" : "GUANGZHOU WORKSHOP PRE-ASSEMBLY"}
              </span>
            </div>

            <p className={styles.compareNote}>
              {"> "} {pair.metric}
            </p>

            <div className={styles.pairTabs}>
              {WORKSHOP_TO_SITE_PAIRS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.pairTab} ${idx === pairIdx ? styles.pairTabActive : ""}`}
                  onClick={() => setPairIdx(idx)}
                >
                  <span>0{idx + 1}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Factory Proof */}
      <section className={styles.section} aria-labelledby="foundry-proof-title">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.monoKicker}>01 // MANUFACTURING WORKFLOW</p>
              <h2 id="foundry-proof-title" className={styles.sectionTitle}>
                Four checkpoints before any panel ships.
              </h2>
            </div>
            <Link href="/about" style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: "0.78rem", fontWeight: 700, color: "var(--copper)" }}>
              INSPECT WORKSHOP PRACTICE →
            </Link>
          </div>

          <div className={styles.proofGrid}>
            {PROCESS_STEPS.map((step) => (
              <article key={step.num} className={styles.proofCard}>
                <div className={styles.proofImg}>
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className={styles.proofBody}>
                  <span>STAGE // {step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Scope Selector */}
      <section className={styles.section} aria-labelledby="foundry-scope-title">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.monoKicker}>02 // CAPABILITY DOSSIER</p>
              <h2 id="foundry-scope-title" className={styles.sectionTitle}>
                Select a metalwork scope to review deliverables.
              </h2>
            </div>
          </div>

          <div className={styles.scopeTabs} role="tablist" aria-label="Technical scopes">
            {DISCIPLINES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={idx === scopeIdx}
                className={`${styles.scopeTab} ${idx === scopeIdx ? styles.scopeTabActive : ""}`}
                onClick={() => setScopeIdx(idx)}
              >
                {item.index} · {item.title}
              </button>
            ))}
          </div>

          <div className={styles.scopePanel} role="tabpanel">
            <div>
              <p className={styles.monoKicker}>{activeScope.subtitle}</p>
              <h3 style={{ fontSize: "1.65rem", fontWeight: 800, margin: "0 0 12px" }}>
                {activeScope.title}
              </h3>
              <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                {activeScope.description}
              </p>
              <ul className={styles.scopeSpecList}>
                {activeScope.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
              <InquiryButton className={styles.rfqBtn} product={{ name: activeScope.inquiry }}>
                Request Engineering Quote <ArrowUpRight size={15} aria-hidden="true" />
              </InquiryButton>
            </div>

            <div className={styles.scopePhotoPair}>
              <div className={styles.scopePhoto}>
                <Image
                  src={activeScope.primaryImage.src}
                  alt={activeScope.primaryImage.alt}
                  fill
                  sizes="(max-width: 1120px) 100vw, 35vw"
                />
              </div>
              <div className={styles.scopePhoto}>
                <Image
                  src={activeScope.secondaryImage.src}
                  alt={activeScope.secondaryImage.alt}
                  fill
                  sizes="(max-width: 1120px) 100vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Project Delivery Matrix */}
      <section className={styles.section} aria-labelledby="foundry-matrix-title">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.monoKicker}>03 // PROJECT DELIVERY REGISTER (2016–2026)</p>
              <h2 id="foundry-matrix-title" className={styles.sectionTitle}>
                Regional &amp; international retail track record.
              </h2>
            </div>

            <div className={styles.regionFilters} role="group" aria-label="Filter deliveries by region">
              {(["All", "Mainland China", "HK & Macau", "International"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${styles.scopeTab} ${region === r ? styles.scopeTabActive : ""}`}
                  onClick={() => setRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.matrixTableWrap}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Development / Mall</th>
                  <th>City / Region</th>
                  <th>Zone</th>
                  <th style={{ textAlign: "right" }}>Register Period</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.slice(0, 10).map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 700 }}>{rec.brand}</td>
                    <td>{rec.place}</td>
                    <td>{rec.location}</td>
                    <td style={{ fontFamily: "ui-monospace, Consolas, monospace", fontSize: "0.75rem", color: "var(--ink-muted)" }}>
                      {classifyRegion(rec.location)}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "ui-monospace, Consolas, monospace", color: "var(--copper)", fontWeight: 700 }}>
                      {rec.period}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.brandMarquee} aria-label="Brands represented in project register">
            {projectBrands.map((brand) => (
              <div key={brand.name}>
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={brand.width}
                  height={brand.height}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RFQ Intake & Footer */}
      <footer className={styles.rfqBand}>
        <div className={styles.container}>
          <div className={styles.rfqBox}>
            <div>
              <p className={styles.monoKicker}>04 // TECHNICAL INQUIRY DESK</p>
              <h2>Have drawings ready for fabrication review?</h2>
              <p>
                Send architectural elevations, Rhino/CAD references, or finish requirements. Our project
                engineers assess forming methods, lead time, and export packing directly from our Guangzhou
                facility.
              </p>
              <InquiryButton className={styles.rfqBtn}>
                Open Technical Brief <ArrowUpRight size={15} aria-hidden="true" />
              </InquiryButton>
            </div>
            <div className={styles.rfqList}>
              {BRIEF_CHECKLIST.map((item) => (
                <div key={item.num} className={styles.rfqItem}>
                  <span>{item.num}</span>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.footerGrid}>
            <div>
              <strong style={{ color: "#ffffff", letterSpacing: "0.12em" }}>GUOYAO METAL</strong>
              <p style={{ margin: "10px 0 4px" }}>{COMPANY_NAME}</p>
              <p style={{ margin: 0 }}>Guangzhou, China · Foundry Blueprint · Concept 04</p>
            </div>
            <div>
              <h4>Routes</h4>
              <nav className={styles.footerLinks} aria-label="Footer navigation">
                {REDESIGN_NAV.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h4>Engineering Desk</h4>
              <div className={styles.footerLinks}>
                <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>
                {SALES_TELEPHONES.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
