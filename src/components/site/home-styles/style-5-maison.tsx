"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { InquiryButton } from "@/components/site/inquiry-contact";
import {
  BRIEF_CHECKLIST,
  DISCIPLINES,
  REDESIGN_IMAGES,
  REDESIGN_NAV,
  projectBrands,
  projectRecords,
} from "@/data/homepage-redesign-data";
import { COMPANY_NAME, SALES_EMAIL, SALES_TELEPHONES } from "@/lib/site-identity";
import styles from "./style-5-maison.module.css";

const MAISON_PLATES = [
  {
    num: "I",
    title: "Sculpted Ivory & Champagne Gold Flagship",
    meta: "Storefront Facade / Installed View",
    image: REDESIGN_IMAGES.cartierIvoryGoldFront,
  },
  {
    num: "II",
    title: "Illuminated Crystal-Textured Corner",
    meta: "Flagship Threshold / Twilight View",
    image: REDESIGN_IMAGES.tiffanyTwilightCorner,
  },
  {
    num: "III",
    title: "Symmetrical Golden Ribbed Escalator Atrium",
    meta: "Architectural Cladding / Installed View",
    image: REDESIGN_IMAGES.escalatorPortal,
  },
] as const;

type EraKey = "2024–2026" | "2021–2023" | "2016–2020";

function eraOf(period: string): EraKey {
  if (period.includes("2025") || period.includes("2024")) return "2024–2026";
  if (period.includes("2023") || period.includes("2022") || period.includes("2021")) return "2021–2023";
  return "2016–2020";
}

export function Style5Maison() {
  const [plateIdx, setPlateIdx] = useState(0);
  const [era, setEra] = useState<EraKey>("2024–2026");
  const [menuOpen, setMenuOpen] = useState(false);

  const activePlate = MAISON_PLATES[plateIdx];
  const eraRecords = projectRecords.filter((r) => eraOf(r.period) === era);

  return (
    <div className={styles.page} data-redesign-home="style-5">
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <nav className={styles.navLeft} aria-label="Primary navigation left">
            <Link href="/case-studies">Projects</Link>
            <Link href="/blog">Journal</Link>
            <Link href="/about">Maison</Link>
          </nav>

          <Link href="/" className={styles.crest}>
            <strong>GUOYAO METAL</strong>
            <span>Haute Architectural Metalwork</span>
          </Link>

          <div className={styles.navRight}>
            <a href={`mailto:${SALES_EMAIL}`}>Concierge</a>
            <InquiryButton className={styles.headerCta}>
              Commission <ArrowUpRight size={14} aria-hidden="true" />
            </InquiryButton>
          </div>

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

        {menuOpen && (
          <nav className={styles.mobileDrawer} aria-label="Mobile navigation">
            {REDESIGN_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <InquiryButton className={styles.btnGold}>
              Private Commission <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
          </nav>
        )}
      </header>

      {/* Split Flagship Curtain Hero */}
      <section className={styles.hero} aria-labelledby="maison-hero-title">
        <div className={styles.heroSalon}>
          <div className={styles.heroSalonInner}>
            <p className={styles.kickerGold}>GUANGZHOU ATELIER · GLOBAL LUXURY RETAIL</p>
            <h1 id="maison-hero-title" className={styles.heroTitle}>
              Architectural Metalwork for the World’s Most <em>Discerning Flagships.</em>
            </h1>
            <p className={styles.heroLead}>
              From luminous luxury boutique facades to hand-hammered antique brass vitrines and sweeping
              staircases, Guoyao Metal realizes architectural signatures with jeweler-grade poise.
            </p>
            <div className={styles.heroBtns}>
              <InquiryButton className={styles.btnGold}>
                Arrange a consultation <ArrowUpRight size={15} aria-hidden="true" />
              </InquiryButton>
              <Link href="/case-studies" className={styles.btnVelvetOutline}>
                View dossier <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.heroFootNote}>
            <span>Facades · Cladding · Stairs · Vitrines</span>
            <span>Register 2016–2026</span>
          </div>
        </div>

        <div className={styles.heroShowcase}>
          <div className={styles.heroVisual}>
            <Image
              src={activePlate.image.src}
              alt={activePlate.image.alt}
              fill
              priority
              sizes="(max-width: 1080px) 100vw, 54vw"
            />
          </div>
          <div className={styles.heroCaptionBar}>
            <div>
              <span>{activePlate.meta}</span>
              <strong>{activePlate.title}</strong>
            </div>
            <div className={styles.heroDots} role="group" aria-label="Switch hero plate">
              {MAISON_PLATES.map((p, idx) => (
                <button
                  key={p.num}
                  type="button"
                  className={`${styles.heroDot} ${idx === plateIdx ? styles.heroDotActive : ""}`}
                  onClick={() => setPlateIdx(idx)}
                >
                  {p.num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Maison Credentials Crest Bar */}
      <section className={styles.credentials} aria-label="Luxury brands in project portfolio">
        <div className={styles.container}>
          <p className={styles.credLabel}>Selected Luxury Maisons in Our Project Register · 2016–2026</p>
          <ul className={styles.credLogos}>
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

      {/* The Four Signatures Salons */}
      <section className={styles.section} aria-labelledby="maison-signatures-title">
        <div className={styles.container}>
          <div className={styles.centerHeader}>
            <p className={styles.kickerGold} style={{ color: "var(--gold)" }}>
              SAVOIR-FAIRE · FOUR SIGNATURES
            </p>
            <h2 id="maison-signatures-title">
              Where monumental scale meets <em>quiet refinement.</em>
            </h2>
            <p>
              Every element is shaped, pre-assembled in full scale inside our Guangzhou workshop, and
              finished to harmonize with stone, glass, and architectural illumination.
            </p>
          </div>

          <div className={styles.salonStack}>
            {DISCIPLINES.map((item, idx) => {
              const reversed = idx % 2 === 1;
              return (
                <article
                  key={item.id}
                  className={`${styles.salonRow} ${reversed ? styles.salonRowReverse : ""}`}
                >
                  {reversed ? (
                    <>
                      <div className={styles.salonCopy}>
                        <span className={styles.salonIndex}>SIGNATURE {item.index}</span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <ul className={styles.salonList}>
                          {item.specs.map((s) => (
                            <li key={s}>✦ {s}</li>
                          ))}
                        </ul>
                        <InquiryButton className={styles.salonLink} product={{ name: item.inquiry }}>
                          Inquire on {item.shortTitle} <ArrowUpRight size={15} aria-hidden="true" />
                        </InquiryButton>
                      </div>
                      <div className={styles.gildedFrame}>
                        <div className={styles.gildedPhoto}>
                          <Image
                            src={item.primaryImage.src}
                            alt={item.primaryImage.alt}
                            fill
                            sizes="(max-width: 1080px) 100vw, 52vw"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.gildedFrame}>
                        <div className={styles.gildedPhoto}>
                          <Image
                            src={item.primaryImage.src}
                            alt={item.primaryImage.alt}
                            fill
                            sizes="(max-width: 1080px) 100vw, 52vw"
                          />
                        </div>
                      </div>
                      <div className={styles.salonCopy}>
                        <span className={styles.salonIndex}>SIGNATURE {item.index}</span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <ul className={styles.salonList}>
                          {item.specs.map((s) => (
                            <li key={s}>✦ {s}</li>
                          ))}
                        </ul>
                        <InquiryButton className={styles.salonLink} product={{ name: item.inquiry }}>
                          Inquire on {item.shortTitle} <ArrowUpRight size={15} aria-hidden="true" />
                        </InquiryButton>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Era Flagship Archive */}
      <section className={styles.archiveBand} aria-labelledby="maison-archive-title">
        <div className={styles.container}>
          <div className={styles.centerHeader} style={{ marginBottom: 40 }}>
            <p className={styles.kickerGold}>GLOBAL FLAGSHIP ARCHIVE</p>
            <h2 id="maison-archive-title" style={{ color: "#fcfaf5" }}>
              A decade of landmark <em>commissions.</em>
            </h2>
            <p style={{ color: "rgba(250, 248, 244, 0.72)" }}>
              Explore representative project records across Shanghai, Beijing, Hong Kong, Macau, Las Vegas,
              Sydney, and Delhi.
            </p>
          </div>

          <div className={styles.eraTabs} role="tablist" aria-label="Archive eras">
            {(["2024–2026", "2021–2023", "2016–2020"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={era === key}
                className={`${styles.eraTab} ${era === key ? styles.eraTabActive : ""}`}
                onClick={() => setEra(key)}
              >
                {key}
              </button>
            ))}
          </div>

          <div className={styles.archiveCards} role="tabpanel">
            {eraRecords.map((rec) => (
              <article key={rec.id} className={styles.archiveCard}>
                <span>{rec.period} · {rec.location}</span>
                <strong>{rec.brand}</strong>
                <p>{rec.place}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gilded Commission Invitation */}
      <section className={styles.inviteSection} aria-labelledby="maison-invite-title">
        <div className={styles.container}>
          <div className={styles.inviteCard}>
            <div className={styles.inviteInner}>
              <p className={styles.kickerGold} style={{ color: "var(--gold)" }}>
                PRIVATE PROJECT CONSULTATION
              </p>
              <h2 id="maison-invite-title">Begin your next architectural signature.</h2>
              <p>
                Share architectural elevations, concept sketches, or finish references. Our Guangzhou
                team provides direct engineering guidance and bespoke sample preparation.
              </p>

              <div className={styles.inviteChecklist}>
                {BRIEF_CHECKLIST.map((item) => (
                  <div key={item.num}>
                    <span>STEP {item.num}</span>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>

              <InquiryButton className={styles.btnGold}>
                Request Private Consultation <ArrowUpRight size={15} aria-hidden="true" />
              </InquiryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Midnight Velvet Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <strong style={{ fontFamily: "var(--font-home-display), Georgia, serif", fontSize: "1.15rem", letterSpacing: "0.22em", color: "#fcfaf5" }}>
                GUOYAO METAL
              </strong>
              <p style={{ margin: "12px 0 4px" }}>{COMPANY_NAME}</p>
              <p style={{ margin: 0, fontSize: "0.84rem" }}>
                Guangzhou, China · Architectural Metalworks for Flagship Spaces.
              </p>
            </div>
            <div>
              <h4>Maison</h4>
              <nav className={styles.footerLinks} aria-label="Footer navigation">
                {REDESIGN_NAV.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h4>Concierge</h4>
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
            <span>MAISON LUMIÈRE · CONCEPT 05</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
