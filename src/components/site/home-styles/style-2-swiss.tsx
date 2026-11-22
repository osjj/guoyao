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
  REDESIGN_IMAGES,
  REDESIGN_NAV,
  projectBrands,
  projectRecords,
} from "@/data/homepage-redesign-data";
import { COMPANY_NAME, SALES_EMAIL, SALES_TELEPHONES } from "@/lib/site-identity";
import styles from "./style-2-swiss.module.css";

const SWISS_HERO_PLATES = [
  {
    code: "PL.01",
    label: "Ivory & Gold Sculpted Facade",
    image: REDESIGN_IMAGES.cartierIvoryGoldFront,
  },
  {
    code: "PL.02",
    label: "Reflective Boutique Elevation",
    image: REDESIGN_IMAGES.tiffanyFrontPanoramic,
  },
  {
    code: "PL.03",
    label: "Ribbed Escalator Atrium",
    image: REDESIGN_IMAGES.escalatorAtriumWide,
  },
] as const;

const PORTFOLIO_INDEX = [
  {
    id: "tiffany-front",
    category: "Facades",
    code: "IDX-01",
    title: "Reflective Storefront Elevation",
    note: "Full-width boutique elevation with precision vertical cladding modules.",
    href: "/case-studies/tiffany-boutique-backlit-facade",
    image: REDESIGN_IMAGES.tiffanyFrontPanoramic,
  },
  {
    id: "cartier-ifs",
    category: "Facades",
    code: "IDX-02",
    title: "Monumental Geometric Bronze Facade",
    note: "Multi-story structured metallic lattice engineered for architectural rhythm.",
    href: "/case-studies",
    image: REDESIGN_IMAGES.cartierIfsDay,
  },
  {
    id: "murray-column",
    category: "Cladding",
    code: "IDX-03",
    title: "Double-Curved Column Pre-Assembly",
    note: "Full-height sculptural brushed stainless column verified on workshop jigs.",
    href: "/case-studies/murray-road-column-cladding",
    image: REDESIGN_IMAGES.murrayColumnFull,
  },
  {
    id: "escalator-pod",
    category: "Cladding",
    code: "IDX-04",
    title: "Compound-Curved Escalator Pod",
    note: "Fluted champagne-toned architectural metal skin trial-fitted before shipment.",
    href: "/case-studies",
    image: REDESIGN_IMAGES.escalatorPodWorkshop,
  },
  {
    id: "stair-spiral",
    category: "Stairs",
    code: "IDX-05",
    title: "Helical Staircase & Bronze Rail",
    note: "Continuous curved balustrade geometry tracked through site installation.",
    href: "/case-studies",
    image: REDESIGN_IMAGES.stairSpiralOverhead,
  },
  {
    id: "fluted-counter",
    category: "Displays",
    code: "IDX-06",
    title: "Fluted Champagne Brass Counter",
    note: "Curved freestanding display counter crafted with uniform ribbed returns.",
    href: "/case-studies",
    image: REDESIGN_IMAGES.flutedBrassCounter,
  },
] as const;

const FILTERS = ["All", "Facades", "Cladding", "Stairs", "Displays"] as const;

export function Style2Swiss() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleItems =
    filter === "All" ? PORTFOLIO_INDEX : PORTFOLIO_INDEX.filter((item) => item.category === filter);

  return (
    <div className={styles.page} data-redesign-home="style-2">
      <header className={styles.header}>
        <div className={styles.headerGrid}>
          <Link href="/" className={styles.brandCell}>
            <Image src="/brand/guoyao-logo-source.png" alt="" width={32} height={32} />
            <strong>GUOYAO METAL</strong>
          </Link>

          <nav className={styles.navCell} aria-label="Primary navigation">
            {REDESIGN_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.ctaCell}>
            <InquiryButton className={styles.headerCta}>
              Submit Brief <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
          </div>

          <button
            type="button"
            className={styles.mobileToggle}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <nav className={styles.mobileDrawer} aria-label="Mobile navigation">
            {REDESIGN_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <InquiryButton className={styles.btnSolid}>
              Submit Brief <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
          </nav>
        )}
      </header>

      <div className={styles.frame}>
        {/* Swiss Split Hero */}
        <section className={styles.hero} aria-labelledby="swiss-hero-title">
          <div className={styles.heroLeft}>
            <div>
              <p className={styles.monoTag}>ARCHITECTURAL METALWORKS · GUANGZHOU, CN</p>
              <h1 id="swiss-hero-title" className={styles.heroTitle}>
                Precision Metal<br />
                for Architectural<br />
                Envelopes.
              </h1>
              <p className={styles.heroDesc}>
                Guoyao Metal engineers, forms, and pre-assembles custom retail facades, curved architectural
                cladding, sculptural staircases, and bespoke metal display fixtures.
              </p>
              <div className={styles.heroButtons}>
                <InquiryButton className={styles.btnSolid}>
                  Discuss a project <ArrowUpRight size={15} aria-hidden="true" />
                </InquiryButton>
                <Link href="/case-studies" className={styles.btnOutline}>
                  Project index <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <dl className={styles.kpiRow}>
              <div>
                <dt>Register Span</dt>
                <dd>2016–2026</dd>
              </div>
              <div>
                <dt>Core Scopes</dt>
                <dd>04 Systems</dd>
              </div>
              <div>
                <dt>Verification</dt>
                <dd>1:1 Mockup</dd>
              </div>
            </dl>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImageWrap}>
              <Image
                src={SWISS_HERO_PLATES[heroIdx].image.src}
                alt={SWISS_HERO_PLATES[heroIdx].image.alt}
                fill
                priority
                sizes="(max-width: 1120px) 100vw, 58vw"
              />
            </div>
            <div className={styles.heroPlateBar}>
              {SWISS_HERO_PLATES.map((plate, i) => (
                <button
                  key={plate.code}
                  type="button"
                  className={`${styles.heroPlateBtn} ${i === heroIdx ? styles.heroPlateBtnActive : ""}`}
                  onClick={() => setHeroIdx(i)}
                >
                  <span>{plate.code}</span>
                  <strong>{plate.label}</strong>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Disciplines Strip */}
        <section className={styles.disciplineStrip} aria-label="Core fabrication disciplines">
          {DISCIPLINES.map((item) => (
            <article key={item.id} className={styles.disciplineCell}>
              <div className={styles.disciplineHead}>
                <span>{item.index}</span>
                <span>{item.shortTitle.toUpperCase()}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <InquiryButton className={styles.inlineInquiry} product={{ name: item.inquiry }}>
                Request spec <ArrowUpRight size={14} aria-hidden="true" />
              </InquiryButton>
            </article>
          ))}
        </section>

        {/* Filterable Work Archive */}
        <section aria-labelledby="swiss-work-title">
          <div className={styles.sectionBar}>
            <div>
              <p className={styles.monoTag}>01 / CURATED WORK INDEX</p>
              <h2 id="swiss-work-title">Installed views &amp; workshop pre-assembly.</h2>
            </div>
            <div className={styles.filterGroup} role="group" aria-label="Filter projects by category">
              {FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.filterBtn} ${filter === cat ? styles.filterBtnActive : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.portfolioGrid}>
            {visibleItems.map((item) => (
              <article key={item.id} className={styles.portfolioCard}>
                <Link href={item.href} className={styles.portfolioThumb}>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className={styles.portfolioMeta}>
                  <span>{item.code} · {item.category}</span>
                  <span>{item.image.stage}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Fabrication Sequence */}
        <section aria-labelledby="swiss-process-title">
          <div className={styles.sectionBar}>
            <div>
              <p className={styles.monoTag}>02 / FABRICATION PROTOCOL</p>
              <h2 id="swiss-process-title">From CAD surface to protected crate.</h2>
            </div>
            <Link href="/blog/metalwork-polishing-brushing-process-and-quality-control" className={styles.btnOutline}>
              Read finishing guide <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.processGrid}>
            {PROCESS_STEPS.map((step) => (
              <article key={step.num} className={styles.processCell}>
                <div className={styles.processPhoto}>
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    fill
                    sizes="(max-width: 1120px) 50vw, 25vw"
                  />
                </div>
                <div className={styles.processBody}>
                  <span>STEP {step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Brands + Project Register */}
        <section className={styles.registerSplit} aria-labelledby="swiss-register-title">
          <div className={styles.brandsBox}>
            <p className={styles.monoTag}>03 / PORTFOLIO EXPERIENCE</p>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 10px" }}>
              Brands in our register.
            </h2>
            <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Selected luxury retail houses represented in Guoyao Metal project records from 2016 through 2026.
            </p>
            <ul className={styles.brandsGrid}>
              {projectBrands.map((brand) => (
                <li key={brand.name}>
                  <Image
                    src={brand.src}
                    alt={brand.name}
                    width={brand.width}
                    height={brand.height}
                    unoptimized
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.registerBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
              <div>
                <p className={styles.monoTag}>PROJECT REGISTER EXCERPT</p>
                <h2 id="swiss-register-title" style={{ fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
                  Selected Global Deliveries
                </h2>
              </div>
              <Link href="/about#project-experience" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)" }}>
                Full archive →
              </Link>
            </div>
            <table className={styles.registerTable}>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Site</th>
                  <th>Location</th>
                  <th style={{ textAlign: "right" }}>Period</th>
                </tr>
              </thead>
              <tbody>
                {projectRecords.slice(0, 9).map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 700 }}>{rec.brand}</td>
                    <td>{rec.place}</td>
                    <td style={{ color: "var(--ink-soft)" }}>{rec.location}</td>
                    <td>{rec.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Brief Band */}
        <section className={styles.briefBand} aria-labelledby="swiss-brief-title">
          <div className={styles.briefLeft}>
            <p className={styles.monoTag}>04 / PROJECT INTAKE</p>
            <h2 id="swiss-brief-title">Start with a drawing or finish reference.</h2>
            <p>
              Share your elevation sketches, approximate quantities, and target site city. Our Guangzhou
              engineering desk responds directly with fabrication feasibility and sample guidance.
            </p>
            <InquiryButton className={styles.btnSolid}>
              Open project inquiry <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
          </div>
          <div className={styles.briefRight}>
            {BRIEF_CHECKLIST.map((item) => (
              <div key={item.num} className={styles.briefItem}>
                <span>{item.num}</span>
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div>
            <strong style={{ color: "var(--ink)", letterSpacing: "0.08em" }}>GUOYAO METAL</strong>
            <p style={{ margin: "10px 0 4px" }}>{COMPANY_NAME}</p>
            <p style={{ margin: 0 }}>Guangzhou, China · Swiss Atelier Index · Concept 02</p>
          </div>
          <div>
            <h4>Directory</h4>
            <nav className={styles.footerNav} aria-label="Footer navigation">
              {REDESIGN_NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h4>Contact</h4>
            <div className={styles.footerNav}>
              <a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>
              {SALES_TELEPHONES.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                  {phone}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
