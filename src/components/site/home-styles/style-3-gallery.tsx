"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { InquiryButton } from "@/components/site/inquiry-contact";
import {
  FEATURED_ARTICLE,
  REDESIGN_IMAGES,
  REDESIGN_NAV,
  SURFACE_FINISHES,
  projectBrands,
} from "@/data/homepage-redesign-data";
import { COMPANY_NAME, SALES_EMAIL, SALES_TELEPHONES } from "@/lib/site-identity";
import styles from "./style-3-gallery.module.css";

const GALLERY_CHAPTERS = [
  {
    id: "chapter-facade",
    num: "Chapter I · Boutique Storefront",
    title: "Light, reflection & the quiet rhythm of a facade.",
    description:
      "Backlit fluted profiles and illuminated surrounds carry the storefront rhythm across a retail corner and around the display openings.",
    href: "/case-studies/backlit-fluted-metal-boutique-facade",
    linkLabel: "View boutique study",
    primary: REDESIGN_IMAGES.backlitFacadeTwilight,
    secondary: REDESIGN_IMAGES.backlitFacadeWindowDetail,
  },
  {
    id: "chapter-column",
    num: "Chapter II · Sculptural Column Cladding",
    title: "Following a double curve down to a single hairline seam.",
    description:
      "Standing full height in the Guangzhou workshop before site dispatch, curved satin stainless steel sheets reveal how structural backing and surface grain meet as one continuous skin.",
    href: "/case-studies/murray-road-column-cladding",
    linkLabel: "View column study",
    primary: REDESIGN_IMAGES.murrayColumnFull,
    secondary: REDESIGN_IMAGES.murrayColumnSeam,
  },
  {
    id: "chapter-stair",
    num: "Chapter III · Monumental Staircase",
    title: "A continuous metallic line drawn through space.",
    description:
      "From sweeping vertical balustrade proportions to the overhead spiral of a continuous dark handrail, stair metalwork demands seamless geometry across every level transition.",
    href: "/case-studies/helical-metal-feature-staircase",
    linkLabel: "View staircase study",
    primary: REDESIGN_IMAGES.stairElevation,
    secondary: REDESIGN_IMAGES.stairSpiralOverhead,
  },
] as const;

export function Style3Gallery() {
  const [activeSurface, setActiveSurface] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const surface = SURFACE_FINISHES[activeSurface];

  return (
    <div className={styles.page} data-redesign-home="style-3">
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <nav className={styles.nav} aria-label="Primary navigation">
            {REDESIGN_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className={styles.brandCenter}>
            <strong>GUOYAO METAL</strong>
            <span>Architectural Metalworks</span>
          </Link>

          <div className={styles.headerRight}>
            <InquiryButton className={styles.headerInquiry}>
              Private Inquiry <ArrowUpRight size={14} aria-hidden="true" />
            </InquiryButton>
            <button
              type="button"
              className={styles.mobileBtn}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={styles.mobileDrawer} aria-label="Mobile navigation">
            {REDESIGN_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <InquiryButton className={styles.btnWarm}>
              Private Inquiry <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
          </nav>
        )}
      </header>

      {/* Editorial Opening */}
      <section className={styles.hero} aria-labelledby="gallery-hero-title">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Material · Form · Architectural Quietness</p>
          <h1 id="gallery-hero-title" className={styles.heroTitle}>
            Metal shaped with architectural poise.
          </h1>
          <p className={styles.heroSub}>
            From our fabrication atelier in Guangzhou, Guoyao Metal crafts custom retail storefronts,
            sculpted atrium cladding, sweeping staircases, and tactile display vitrines for considered spaces.
          </p>
          <div className={styles.heroActions}>
            <InquiryButton className={styles.btnWarm}>
              Discuss your project <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
            <Link href="/case-studies" className={styles.btnText}>
              Browse project stories <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <figure className={styles.museumMat}>
            <div className={styles.museumPhoto}>
              <Image
                src={REDESIGN_IMAGES.escalatorAtriumWide.src}
                alt={REDESIGN_IMAGES.escalatorAtriumWide.alt}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1220px"
              />
            </div>
            <figcaption className={styles.museumCaption}>
              <span>Plate 01 — Sculpted Ribbed Escalator Cladding</span>
              <span>Installed Architectural View</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Three Curated Diptych Chapters */}
      <section className={styles.section} aria-labelledby="gallery-chapters-title">
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.eyebrow}>Selected Studies</p>
              <h2 id="gallery-chapters-title" className={styles.sectionTitle}>
                Reading the whole alongside the detail.
              </h2>
            </div>
            <p className={styles.sectionLead}>
              Each architectural metal commission lives at two scales at once: the immediate spatial gesture
              perceived across a room, and the millimeter precision of a joint seen at arm’s length.
            </p>
          </div>

          <div className={styles.chapterStack}>
            {GALLERY_CHAPTERS.map((chapter, index) => (
              <article
                key={chapter.id}
                className={`${styles.chapter} ${index % 2 === 1 ? styles.chapterReverse : ""}`}
              >
                {index % 2 === 1 ? (
                  <>
                    <div className={styles.chapterSide}>
                      <div className={styles.chapterPhotoSecondary}>
                        <Image
                          src={chapter.secondary.src}
                          alt={chapter.secondary.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 38vw"
                        />
                      </div>
                      <div className={styles.chapterCopy}>
                        <p className={styles.chapterMeta}>{chapter.num}</p>
                        <h3>{chapter.title}</h3>
                        <p>{chapter.description}</p>
                        <Link href={chapter.href} className={styles.chapterLink}>
                          {chapter.linkLabel} <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                    <div className={styles.chapterPhotoPrimary}>
                      <Image
                        src={chapter.primary.src}
                        alt={chapter.primary.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.chapterPhotoPrimary}>
                      <Image
                        src={chapter.primary.src}
                        alt={chapter.primary.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                      />
                    </div>
                    <div className={styles.chapterSide}>
                      <div className={styles.chapterPhotoSecondary}>
                        <Image
                          src={chapter.secondary.src}
                          alt={chapter.secondary.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 38vw"
                        />
                      </div>
                      <div className={styles.chapterCopy}>
                        <p className={styles.chapterMeta}>{chapter.num}</p>
                        <h3>{chapter.title}</h3>
                        <p>{chapter.description}</p>
                        <Link href={chapter.href} className={styles.chapterLink}>
                          {chapter.linkLabel} <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tactile Material & Finish Atelier */}
      <section className={`${styles.section} ${styles.surfaceBand}`} aria-labelledby="gallery-surface-title">
        <div className={styles.container}>
          <div className={styles.surfaceGrid}>
            <div>
              <p className={styles.eyebrow}>Surface &amp; Finish Atelier</p>
              <h2 id="gallery-surface-title" className={styles.sectionTitle}>
                How metal holds light and touch.
              </h2>
              <div className={styles.swatchList} role="tablist" aria-label="Architectural metal finishes">
                {SURFACE_FINISHES.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeSurface}
                    className={`${styles.swatchBtn} ${idx === activeSurface ? styles.swatchBtnActive : ""}`}
                    onClick={() => setActiveSurface(idx)}
                  >
                    <span className={styles.swatchDot} style={{ background: item.tone }} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.code}</span>
                    </div>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <InquiryButton className={styles.btnWarm} product={{ name: `${surface.name} sample` }}>
                Request finish sample <ArrowUpRight size={15} aria-hidden="true" />
              </InquiryButton>
            </div>

            <div className={styles.surfaceFrame} role="tabpanel">
              <div className={styles.surfaceImg}>
                <Image
                  src={surface.image.src}
                  alt={surface.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                />
              </div>
              <div className={styles.surfaceCaption}>
                <strong style={{ display: "block", color: "var(--ink)", marginBottom: 6 }}>
                  {surface.caption}
                </strong>
                {surface.note}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Brand Colophon */}
      <section className={`${styles.section} ${styles.colophon}`} aria-label="Selected brand experience">
        <div className={styles.container}>
          <p className={styles.eyebrow}>Project Portfolio Experience · 2016–2026</p>
          <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)" }}>
            Trusted across iconic luxury retail destinations.
          </h2>
          <ul className={styles.brandRow}>
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

      {/* Technical Journal Feature */}
      <section className={styles.section} aria-labelledby="gallery-journal-title">
        <div className={styles.container}>
          <div className={styles.journalGrid}>
            <Link href={FEATURED_ARTICLE.href} className={styles.journalPhoto}>
              <Image
                src={REDESIGN_IMAGES.cartierIvoryGoldAngle.src}
                alt={REDESIGN_IMAGES.cartierIvoryGoldAngle.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Link>
            <article className={styles.journalCopy}>
              <p className={styles.eyebrow}>{FEATURED_ARTICLE.kicker}</p>
              <h3 id="gallery-journal-title">{FEATURED_ARTICLE.title}</h3>
              <p>{FEATURED_ARTICLE.summary}</p>
              <Link href={FEATURED_ARTICLE.href} className={styles.chapterLink}>
                Read technical article <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Espresso Salon Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerTop}>
            <p className={styles.eyebrow} style={{ color: "#c8ad7f" }}>
              Begin a Conversation
            </p>
            <h2>Share the architecture you are bringing into form.</h2>
            <p>
              Send an initial sketch, elevation drawing, or finish reference. Our Guangzhou atelier reviews
              every architectural metalwork inquiry directly.
            </p>
            <InquiryButton className={styles.btnLight}>
              Discuss your project <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
          </div>

          <div className={styles.footerBottom}>
            <div>
              <strong style={{ color: "#f3efe7", letterSpacing: "0.18em" }}>GUOYAO METAL</strong>
              <p style={{ margin: "10px 0 4px" }}>{COMPANY_NAME}</p>
              <p style={{ margin: 0 }}>Guangzhou, China · Alabaster Gallery · Concept 03</p>
            </div>
            <div>
              <h4>Explore</h4>
              <nav className={styles.footerLinks} aria-label="Footer navigation">
                {REDESIGN_NAV.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h4>Direct Desk</h4>
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
