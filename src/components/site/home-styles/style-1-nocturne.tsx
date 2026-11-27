"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { InquiryButton } from "@/components/site/inquiry-contact";
import {
  BRIEF_CHECKLIST,
  DISCIPLINES,
  FEATURED_CASE_STUDIES,
  REDESIGN_IMAGES,
  REDESIGN_NAV,
  projectBrands,
  projectRecords,
} from "@/data/homepage-redesign-data";
import { COMPANY_NAME, SALES_EMAIL, SALES_TELEPHONES } from "@/lib/site-identity";
import styles from "./style-1-nocturne.module.css";

const HERO_PLATES = [
  {
    id: "01",
    title: "Backlit Geometric Facade",
    subtitle: "Architectural retail lattice / Night view",
    image: REDESIGN_IMAGES.cartierNightLattice,
  },
  {
    id: "02",
    title: "Sculpted Escalator Atrium",
    subtitle: "Ribbed champagne metal cladding / Installed",
    image: REDESIGN_IMAGES.escalatorAtriumWide,
  },
  {
    id: "03",
    title: "Illuminated Boutique Corner",
    subtitle: "Crystal-textured facade / Dusk installation",
    image: REDESIGN_IMAGES.tiffanyTwilightFacade,
  },
  {
    id: "04",
    title: "Helical Metal Staircase",
    subtitle: "Curved balustrade & dark handrail / Site work",
    image: REDESIGN_IMAGES.stairSpiralOverhead,
  },
] as const;

const WORKSHOP_HIGHLIGHTS = [
  {
    title: "Full-Scale Escalator Pod Pre-Assembly",
    tag: "Compound Curvature / Workshop Jig",
    image: REDESIGN_IMAGES.escalatorPodWorkshop,
  },
  {
    title: "Double-Curved Column Seam Verification",
    tag: "Hairline Satin Stainless / Detail",
    image: REDESIGN_IMAGES.murrayColumnSeam,
  },
  {
    title: "Hand-Hammered Brass Vitrine Lighting",
    tag: "Hospitality & Retail Fixture / Test",
    image: REDESIGN_IMAGES.hammeredVitrineLit,
  },
] as const;

export function Style1Nocturne() {
  const [activePlate, setActivePlate] = useState(0);
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePlate((prev) => (prev + 1) % HERO_PLATES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  const currentDiscipline = DISCIPLINES[activeDiscipline];

  return (
    <div className={styles.page} data-redesign-home="style-1">
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>
              <Image src="/brand/guoyao-logo-source.png" alt="" width={40} height={40} />
            </span>
            <span className={styles.brandText}>
              <strong>GUOYAO METAL</strong>
              <span>Architectural Metalworks</span>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Primary navigation">
            {REDESIGN_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <InquiryButton className={styles.headerCta}>
            Discuss a project <ArrowUpRight size={15} aria-hidden="true" />
          </InquiryButton>

          <button
            type="button"
            className={styles.mobileMenuBtn}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
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
            <InquiryButton className={styles.primaryBtn}>
              Discuss a project <ArrowUpRight size={16} aria-hidden="true" />
            </InquiryButton>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className={styles.hero} aria-labelledby="nocturne-hero-title">
        <div className={styles.heroBackdrop} aria-hidden="true">
          {HERO_PLATES.map((plate, index) => (
            <div
              key={plate.id}
              className={`${styles.heroSlide} ${index === activePlate ? styles.heroSlideActive : ""}`}
            >
              <Image
                src={plate.image.src}
                alt={plate.image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
        <div className={styles.heroScrim} aria-hidden="true" />

        <div className={`${styles.container} ${styles.heroContent}`}>
          <div>
            <p className={styles.heroEyebrow}>GUANGZHOU · BESPOKE ARCHITECTURAL METALWORK</p>
            <h1 id="nocturne-hero-title" className={styles.heroTitle}>
              Metal, forged for<br />
              <em>defining spaces.</em>
            </h1>
            <p className={styles.heroLead}>
              Custom architectural facades, compound-curved cladding, sculptural staircases, and luxury display
              vitrines — engineered, pre-assembled in full scale, and finished for flagship spaces worldwide.
            </p>
            <div className={styles.heroActions}>
              <InquiryButton className={styles.primaryBtn}>
                Start a project brief <ArrowUpRight size={16} aria-hidden="true" />
              </InquiryButton>
              <Link href="/case-studies" className={styles.ghostBtn}>
                Explore case studies <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className={styles.plateDeck} aria-label="Featured architectural plates">
            <div className={styles.plateDeckHeader}>
              <span>ARCHITECTURAL PLATES</span>
              <span>
                {HERO_PLATES[activePlate].id} / 0{HERO_PLATES.length}
              </span>
            </div>
            <div className={styles.plateList}>
              {HERO_PLATES.map((plate, index) => (
                <button
                  key={plate.id}
                  type="button"
                  className={`${styles.plateBtn} ${index === activePlate ? styles.plateBtnActive : ""}`}
                  onClick={() => setActivePlate(index)}
                >
                  <span className={styles.plateNum}>{plate.id}</span>
                  <span className={styles.plateMeta}>
                    <strong>{plate.title}</strong>
                    <span>{plate.subtitle}</span>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* Brand Heritage Ribbon */}
      <section className={styles.brandStrip} aria-label="Selected brand project experience">
        <div className={`${styles.container} ${styles.brandStripInner}`}>
          <div className={styles.brandStripLabel}>
            <p>Project Experience · 2016–2026</p>
            <span>Luxury retail maisons represented in our fabrication register.</span>
          </div>
          <ul className={styles.brandLogos}>
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
      </section>

      {/* Featured Case Studies */}
      <section className={styles.section} aria-labelledby="nocturne-cases-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>01 / SELECTED COMMISSIONS</p>
              <h2 id="nocturne-cases-title" className={styles.sectionTitle}>
                Architecture seen through <em>surface &amp; structure.</em>
              </h2>
            </div>
            <Link href="/case-studies" className={styles.sectionLink}>
              All project stories <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.caseGrid}>
            {FEATURED_CASE_STUDIES.map((study) => (
              <article key={study.slug} className={styles.caseCard}>
                <Link href={study.slug} className={styles.caseVisual}>
                  <Image
                    src={study.leadImage.src}
                    alt={study.leadImage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <span className={styles.caseBadge}>{study.stage}</span>
                </Link>
                <div className={styles.caseBody}>
                  <div className={styles.caseMeta}>
                    <span>{study.category}</span>
                    <span>{study.index}</span>
                  </div>
                  <h3>{study.title}</h3>
                  <p>{study.summary}</p>
                  <Link href={study.slug} className={styles.caseLink}>
                    Read project study <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 4-Discipline Matrix */}
      <section className={styles.section} aria-labelledby="nocturne-disciplines-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>02 / FABRICATION DISCIPLINES</p>
              <h2 id="nocturne-disciplines-title" className={styles.sectionTitle}>
                Four realms of <em>custom metalwork.</em>
              </h2>
            </div>
            <InquiryButton className={styles.sectionLink} product={{ name: currentDiscipline.inquiry }}>
              Inquire about {currentDiscipline.shortTitle} <ArrowUpRight size={16} aria-hidden="true" />
            </InquiryButton>
          </div>

          <div className={styles.disciplineShell}>
            <div className={styles.disciplineTabs} role="tablist" aria-label="Fabrication disciplines">
              {DISCIPLINES.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeDiscipline}
                  className={`${styles.disciplineTab} ${idx === activeDiscipline ? styles.disciplineTabActive : ""}`}
                  onClick={() => setActiveDiscipline(idx)}
                >
                  <span className={styles.disciplineTabNum}>{item.index}</span>
                  <span>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.disciplineStage} role="tabpanel">
              <div className={styles.disciplinePhotos}>
                <div className={styles.disciplinePhotoBox}>
                  <Image
                    src={currentDiscipline.primaryImage.src}
                    alt={currentDiscipline.primaryImage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <span className={styles.photoTag}>{currentDiscipline.primaryImage.stage}</span>
                </div>
                <div className={styles.disciplinePhotoBox}>
                  <Image
                    src={currentDiscipline.secondaryImage.src}
                    alt={currentDiscipline.secondaryImage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                  />
                  <span className={styles.photoTag}>{currentDiscipline.secondaryImage.stage}</span>
                </div>
              </div>
              <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                {currentDiscipline.description}
              </p>
              <div className={styles.disciplineDetails}>
                <div className={styles.specPills}>
                  {currentDiscipline.specs.map((spec) => (
                    <span key={spec}>{spec}</span>
                  ))}
                </div>
                <InquiryButton className={styles.primaryBtn} product={{ name: currentDiscipline.inquiry }}>
                  Request specification <ArrowUpRight size={15} aria-hidden="true" />
                </InquiryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Lightbox */}
      <section className={`${styles.section} ${styles.workshopSection}`} aria-labelledby="nocturne-workshop-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>03 / INSIDE THE GUANGZHOU WORKSHOP</p>
              <h2 id="nocturne-workshop-title" className={styles.sectionTitle}>
                Verified in full scale <em>before it reaches site.</em>
              </h2>
            </div>
            <Link href="/about" className={styles.sectionLink}>
              Our fabrication practice <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.workshopGrid}>
            {WORKSHOP_HIGHLIGHTS.map((item) => (
              <figure key={item.title} className={styles.workshopCard}>
                <div className={styles.workshopImg}>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.tag}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Illuminated Project Ledger */}
      <section className={styles.section} aria-labelledby="nocturne-ledger-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>04 / SELECTED PROJECT ARCHIVE</p>
              <h2 id="nocturne-ledger-title" className={styles.sectionTitle}>
                A decade across <em>global flagship destinations.</em>
              </h2>
            </div>
            <Link href="/about#project-experience" className={styles.sectionLink}>
              View complete register <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <table className={styles.ledgerTable}>
            <thead>
              <tr>
                <th>Maison / Brand</th>
                <th>Destination</th>
                <th>City / Region</th>
                <th style={{ textAlign: "right" }}>Register Period</th>
              </tr>
            </thead>
            <tbody>
              {projectRecords.slice(0, 8).map((record) => (
                <tr key={record.id}>
                  <td className={styles.ledgerBrand}>{record.brand}</td>
                  <td className={styles.ledgerPlace}>{record.place}</td>
                  <td className={styles.ledgerPlace}>{record.location}</td>
                  <td className={styles.ledgerPeriod}>{record.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Closing Brief */}
      <section className={styles.closing} aria-labelledby="nocturne-brief-title">
        <div className={styles.container}>
          <div className={styles.closingBox}>
            <div>
              <p className={styles.kicker}>05 / START A CONVERSATION</p>
              <h2 id="nocturne-brief-title">
                Bring your drawings.<br />
                <em>We will build the reality.</em>
              </h2>
              <p>
                Whether you are resolving a backlit luxury facade, a sculptural curved column, or a bespoke
                vitrine package, our engineering and workshop teams respond directly from Guangzhou.
              </p>
              <InquiryButton className={styles.primaryBtn}>
                Send project brief <ArrowUpRight size={16} aria-hidden="true" />
              </InquiryButton>
            </div>
            <ol className={styles.checklist}>
              {BRIEF_CHECKLIST.map((item) => (
                <li key={item.num}>
                  <span>{item.num}</span>
                  <div>{item.label}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <span className={styles.brandText}>
                <strong>GUOYAO METAL</strong>
                <span>Architectural Metalworks</span>
              </span>
              <p className={styles.footerCompany}>{COMPANY_NAME}</p>
              <p style={{ margin: 0, color: "var(--ink-muted)", fontSize: "0.84rem" }}>
                Guangzhou, China · Serving luxury retail &amp; landmark architecture globally.
              </p>
            </div>
            <div>
              <span className={styles.footerColTitle}>Navigation</span>
              <nav className={styles.footerLinks} aria-label="Footer navigation">
                {REDESIGN_NAV.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <span className={styles.footerColTitle}>Direct Contact</span>
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
          <div className={styles.footerBottom}>
            <span>© {new Date().getFullYear()} GUOYAO METAL</span>
            <span>NOCTURNE MONOLITH · CONCEPT 01</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
