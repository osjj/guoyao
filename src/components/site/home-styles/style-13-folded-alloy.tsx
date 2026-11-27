"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Layers,
  Menu,
  MoveHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { HeaderContactBar, InquiryButton } from "@/components/site/inquiry-contact";
import {
  BRIEF_CHECKLIST,
  DISCIPLINES,
  FEATURED_ARTICLE,
  FEATURED_CASE_STUDIES,
  PROCESS_STEPS,
  SURFACE_FINISHES,
  WORKSHOP_TO_SITE_PAIRS,
  projectBrands,
  projectRecords,
} from "@/data/homepage-redesign-data";
import { PRIMARY_NAVIGATION, SALES_EMAIL } from "@/lib/site-identity";
import {
  EmberField,
  ParticleMorph,
  type MorphShape,
} from "./style-10-liquid-effects";
import { FoldedAlloyCanvas } from "./style-13-folded-alloy-canvas";
import styles from "./style-10-liquid.module.css";
import alloyStyles from "./style-13-folded-alloy.module.css";

const MORPH_LABELS: Record<MorphShape, { tag: string; readout: string }> = {
  cloud: { tag: "STATE 00 · AMBIENT ALLOY", readout: "2,000 suspended alloy particles" },
  facades: { tag: "STATE 01 · DIAMOND LATTICE", readout: "Backlit modular facade geometry" },
  cladding: { tag: "STATE 02 · FLUTED COLUMN", readout: "Compound-curved ribbed enclosure" },
  stairs: { tag: "STATE 03 · HELICAL STAIR", readout: "Continuous rolled balustrade sweep" },
  displays: { tag: "STATE 04 · DISPLAY VITRINE", readout: "Mitered brass & illuminated case" },
};

const REGION_FILTERS = ["All", "Greater China", "International"] as const;
type RegionFilter = (typeof REGION_FILTERS)[number];

const INTERNATIONAL_LOCATIONS = new Set(["United States", "Australia", "Delhi"]);

function trackCardSheen(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

function ParticleDisciplineLab() {
  const [selectedId, setSelectedId] = useState<MorphShape>("facades");
  const activeDiscipline = useMemo(
    () => DISCIPLINES.find((d) => d.id === selectedId) ?? DISCIPLINES[0],
    [selectedId],
  );
  const morphMeta = MORPH_LABELS[selectedId];

  return (
    <section
      id="liquid-disciplines"
      className={styles.section}
      aria-labelledby="liquid-disciplines-title"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>
              <Sparkles size={13} aria-hidden="true" /> 01 · Interactive Particle Forming
            </p>
            <h2 id="liquid-disciplines-title" className={styles.sectionTitle}>
              From molten state to <span className={styles.displayItalic}>architectural geometry.</span>
            </h2>
          </div>
          <p className={styles.sectionIntro}>
            Select a fabrication discipline to morph the live 3D particle cloud into its structural silhouette—or sweep your cursor across the field to disturb the alloy.
          </p>
        </div>

        <div className={styles.particleGrid}>
          <div className={styles.particleStage}>
            <ParticleMorph shape={selectedId} className={styles.particleCanvas} />
            <div className={styles.stageHudTop}>
              <span className={styles.hudTag}>
                <span className={styles.liveDot} aria-hidden="true" />
                {morphMeta.tag}
              </span>
              <button
                type="button"
                className={`${styles.cloudBtn} ${selectedId === "cloud" ? styles.cloudBtnActive : ""}`}
                onClick={() => setSelectedId("cloud")}
              >
                Disperse Cloud
              </button>
            </div>
            <div className={styles.stageCrosshair} aria-hidden="true" />
            <div className={styles.stageHudBottom}>
              <div>
                <span className={styles.hudLabel}>Active Vector</span>
                <strong>{morphMeta.readout}</strong>
              </div>
              <span className={styles.hudHint}>Move pointer over canvas to repel</span>
            </div>
          </div>

          <div className={styles.disciplineColumn}>
            <div className={styles.disciplineTabs} role="tablist" aria-label="Fabrication disciplines">
              {DISCIPLINES.map((item) => {
                const isActive = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.disciplineTab} ${isActive ? styles.disciplineTabActive : ""}`}
                    onClick={() => setSelectedId(item.id)}
                    onMouseEnter={() => setSelectedId(item.id)}
                  >
                    <span className={styles.tabNum}>{item.index}</span>
                    <span className={styles.tabText}>
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                    </span>
                    <ArrowUpRight size={16} className={styles.tabArrow} aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <article className={styles.disciplineDetail} onPointerMove={trackCardSheen}>
              <div className={styles.detailMediaPair}>
                <figure className={styles.detailPhoto}>
                  <Image
                    src={activeDiscipline.primaryImage.src}
                    alt={activeDiscipline.primaryImage.alt}
                    fill
                    sizes="(max-width: 960px) 100vw, 28vw"
                  />
                  <figcaption>{activeDiscipline.primaryImage.stage}</figcaption>
                </figure>
                <figure className={styles.detailPhoto}>
                  <Image
                    src={activeDiscipline.secondaryImage.src}
                    alt={activeDiscipline.secondaryImage.alt}
                    fill
                    sizes="(max-width: 960px) 100vw, 28vw"
                  />
                  <figcaption>{activeDiscipline.secondaryImage.stage}</figcaption>
                </figure>
              </div>
              <div className={styles.detailCopy}>
                <p>{activeDiscipline.description}</p>
                <ul className={styles.specList}>
                  {activeDiscipline.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
                <InquiryButton
                  className={styles.glassCta}
                  product={{ name: activeDiscipline.inquiry }}
                >
                  Request specs for {activeDiscipline.shortTitle.toLowerCase()}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </InquiryButton>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkshopLiquidCompare() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [split, setSplit] = useState(50);
  const pair = WORKSHOP_TO_SITE_PAIRS[activeIndex];

  return (
    <section
      id="liquid-workshop"
      className={`${styles.section} ${styles.workshopSection}`}
      aria-labelledby="liquid-workshop-title"
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>
              <Layers size={13} aria-hidden="true" /> 03 · Full-Scale 1:1 Verification
            </p>
            <h2 id="liquid-workshop-title" className={styles.sectionTitle}>
              Trial-assembled in Guangzhou, <span className={styles.displayItalic}>exact on site.</span>
            </h2>
          </div>
          <div className={styles.compareTabs} role="group" aria-label="Select workshop comparison project">
            {WORKSHOP_TO_SITE_PAIRS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={activeIndex === idx}
                className={`${styles.pillTab} ${activeIndex === idx ? styles.pillTabActive : ""}`}
                onClick={() => {
                  setActiveIndex(idx);
                  setSplit(50);
                }}
              >
                <span>0{idx + 1}</span>
                {item.id === "escalator"
                  ? "Atrium Cladding"
                  : item.id === "facade"
                    ? "Backlit Facade"
                    : "Helical Stair"}
              </button>
            ))}
          </div>
        </div>

        <div
          className={styles.compareViewport}
          style={{ "--split": `${split}%` } as CSSProperties}
        >
          <div className={styles.compareBase}>
            <Image
              src={pair.installed.src}
              alt={pair.installed.alt}
              fill
              sizes="(max-width: 1360px) 100vw, 1320px"
            />
            <span className={`${styles.compareBadge} ${styles.badgeRight}`}>
              {pair.installed.stage}
            </span>
          </div>

          <div className={styles.compareReveal}>
            <Image
              src={pair.workshop.src}
              alt={pair.workshop.alt}
              fill
              sizes="(max-width: 1360px) 100vw, 1320px"
            />
            <span className={`${styles.compareBadge} ${styles.badgeLeft}`}>
              Guangzhou 1:1 Workshop
            </span>
          </div>

          <div className={styles.splitRail} aria-hidden="true">
            <span className={styles.splitKnob}>
              <MoveHorizontal size={18} />
            </span>
          </div>

          <input
            type="range"
            min={4}
            max={96}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            className={styles.splitRange}
            aria-label="Drag to compare Guangzhou workshop pre-assembly with installed site view"
            aria-valuetext={`${split}% workshop view`}
          />
        </div>

        <div className={styles.compareMeta} aria-live="polite">
          <div>
            <strong>{pair.label}</strong>
            <span>{pair.scope}</span>
          </div>
          <p>{pair.metric}</p>
        </div>

        <ol className={styles.processGrid}>
          {PROCESS_STEPS.map((step) => (
            <li
              key={step.num}
              className={styles.processCard}
              onPointerMove={trackCardSheen}
            >
              <div className={styles.processThumb}>
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 25vw"
                />
              </div>
              <div className={styles.processBody}>
                <span className={styles.processNum}>{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AlloyFinishLab() {
  const [index, setIndex] = useState(0);
  const current = SURFACE_FINISHES[index];

  return (
    <section
      id="liquid-finishes"
      className={styles.section}
      aria-labelledby="liquid-finishes-title"
    >
      <div className={styles.container}>
        <div
          className={styles.finishShell}
          style={{ "--finish-tone": current.tone } as CSSProperties}
        >
          <div className={styles.finishGlow} aria-hidden="true" />

          <div className={styles.finishLeft}>
            <p className={styles.eyebrow}>04 · Surface &amp; Alloy Specular Lab</p>
            <h2 id="liquid-finishes-title" className={styles.sectionTitle}>
              Tactile grain, <span className={styles.displayItalic}>controlled light.</span>
            </h2>
            <p className={styles.finishLead}>
              Inspect directional brushing, fluted champagne brass, hand-hammered patina, and illuminated rod facades under grazing studio light.
            </p>

            <div className={styles.finishSelector} role="group" aria-label="Surface finishes">
              {SURFACE_FINISHES.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={index === idx}
                  className={`${styles.finishBtn} ${index === idx ? styles.finishBtnActive : ""}`}
                  onClick={() => setIndex(idx)}
                >
                  <span
                    className={styles.finishOrb}
                    style={{ background: `radial-gradient(circle at 30% 30%, #ffffff, ${item.tone} 58%, #1a1816 100%)` }}
                    aria-hidden="true"
                  />
                  <span className={styles.finishBtnInfo}>
                    <small>{item.code}</small>
                    <strong>{item.name}</strong>
                  </span>
                  <ArrowUpRight size={15} className={styles.finishBtnIcon} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          <figure className={styles.finishShowcase} aria-live="polite">
            <div className={styles.finishFrame}>
              <Image
                src={current.image.src}
                alt={current.image.alt}
                fill
                sizes="(max-width: 960px) 100vw, 54vw"
              />
              <span className={styles.finishCodeTag}>{current.code}</span>
            </div>
            <figcaption className={styles.finishCaption}>
              <div className={styles.finishCaptionHead}>
                <strong>{current.name}</strong>
                <span>{current.caption}</span>
              </div>
              <p>{current.note}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function Style13FoldedAlloy() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [region, setRegion] = useState<RegionFilter>("All");
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const desktop = window.matchMedia("(width > 960px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    // Keep the inquiry button available when the dialog restores focus.
    const dialogIsOpen = () => document.querySelector("dialog[open]") !== null;
    const closeOnOutsidePress = (event: globalThis.PointerEvent) => {
      if (dialogIsOpen()) return;
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || dialogIsOpen()) return;
      if (headerRef.current?.contains(document.activeElement)) menuButtonRef.current?.focus();
      setMenuOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const filteredRecords = useMemo(() => {
    if (region === "All") return projectRecords;
    return projectRecords.filter((rec) =>
      region === "International"
        ? INTERNATIONAL_LOCATIONS.has(rec.location)
        : !INTERNATIONAL_LOCATIONS.has(rec.location),
    );
  }, [region]);

  const visibleRecords = showAllRecords ? filteredRecords : filteredRecords.slice(0, 6);

  return (
    <div
      ref={pageRef}
      id="liquid-home"
      className={`${styles.page} ${alloyStyles.home}`}
      data-redesign-home="style-13"
    >
      <div
        className={styles.scrollTrack}
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <header ref={headerRef} className={`${styles.header} ${alloyStyles.navigationHeader}`}>
        <div className={styles.headerInner}>
          <a href="#liquid-home" className={styles.brand} aria-label="Guoyao Metal, back to top" onClick={() => setMenuOpen(false)}>
            <span className={styles.brandOrb} aria-hidden="true" />
            <span>GUOYAO</span>
            <span className={styles.brandSub}>METAL</span>
          </a>

          <nav className={`${styles.nav} ${alloyStyles.primaryNav}`} aria-label="Primary navigation">
            {PRIMARY_NAVIGATION.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={href === "/" ? "page" : undefined}>
                {label}
              </Link>
            ))}
          </nav>

          <div className={styles.headerRight}>
            <HeaderContactBar />
            <InquiryButton className={`${styles.moltenCta} ${alloyStyles.desktopInquiry}`}>
              Start a Project <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
            <button
              type="button"
              ref={menuButtonRef}
              className={`${styles.menuBtn} ${alloyStyles.menuToggle}`}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="liquid-mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              Menu
            </button>
          </div>
        </div>

        <nav id="liquid-mobile-nav" className={`${styles.mobileNav} ${alloyStyles.mobileMenu}`} hidden={!menuOpen} aria-label="Mobile navigation">
          {PRIMARY_NAVIGATION.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={href === "/" ? "page" : undefined}
              onNavigate={() => {
                if (href === "/") menuButtonRef.current?.focus();
                setMenuOpen(false);
              }}
            >
              {label}
            </Link>
          ))}
          <InquiryButton className={styles.moltenCta}>
            Start a Project <ArrowUpRight size={15} aria-hidden="true" />
          </InquiryButton>
        </nav>
      </header>

      {/* HERO: Polished liquid-metal folds + rising molten embers */}
      <section className={styles.hero} aria-labelledby="liquid-hero-title">
        <div className={styles.heroCanvasWrap}>
          <FoldedAlloyCanvas className={`${styles.liquidCanvas} ${alloyStyles.canvas}`} />
          <EmberField className={styles.emberCanvas} density={68} />
          <div className={alloyStyles.scrim} aria-hidden="true" />
        </div>

        <div className={`${styles.container} ${styles.heroInner}`}>
          <div className={styles.heroTopRow}>
            <span className={styles.statusChip}>
              <span className={styles.liveDot} aria-hidden="true" />
              Architectural Metalwork · Guangzhou Foundry
            </span>
            <span className={styles.interactPrompt}>
              Move cursor to sculpt mercury · Click to ripple
            </span>
          </div>

          <div className={styles.heroCenter}>
            <h1 id="liquid-hero-title" className={styles.heroTitle}>
              <span className={styles.chromeText}>Molten precision,</span>
              <span className={styles.heroItalic}>cast into architecture.</span>
            </h1>
            <p className={styles.heroLead}>
              Bespoke facades, compound-curved cladding, helical staircases, and illuminated brass vitrines—engineered, brushed, and trial-assembled at 1:1 scale before reaching global luxury flagships.
            </p>
            <div className={styles.heroActions}>
              <InquiryButton className={styles.moltenCtaLg}>
                Commission a Project <ArrowUpRight size={17} aria-hidden="true" />
              </InquiryButton>
              <a href="#liquid-disciplines" className={styles.outlineCta}>
                Enter Particle Lab <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={styles.heroTelemetry}>
            <div className={styles.telemetryCell}>
              <span>Pre-Assembly Protocol</span>
              <strong>1:1 Full-Scale Guangzhou Jig</strong>
            </div>
            <div className={styles.telemetryCell}>
              <span>Material Mastery</span>
              <strong>Stainless · Brass · Bronze · Glass</strong>
            </div>
            <div className={styles.telemetryCell}>
              <span>Project Register</span>
              <strong>2016–2026 Luxury Flagships</strong>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: Interactive 3D Particle Morphing Disciplines */}
      <ParticleDisciplineLab />

      {/* SECTION 02: Selected Case Studies with Dual-Image Crossfade */}
      <section
        id="liquid-works"
        className={styles.section}
        aria-labelledby="liquid-works-title"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>02 · Selected Architectural Works</p>
              <h2 id="liquid-works-title" className={styles.sectionTitle}>
                Monumental scale, <span className={styles.displayItalic}>hairline seam.</span>
              </h2>
            </div>
            <Link href="/case-studies" className={styles.inlineLink}>
              Explore all case studies <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.caseGrid}>
            {FEATURED_CASE_STUDIES.map((work, idx) => (
              <Link
                key={work.slug}
                href={work.slug}
                className={`${styles.caseCard} ${idx === 0 ? styles.caseCardWide : ""}`}
                onPointerMove={trackCardSheen}
              >
                <div className={styles.caseVisual}>
                  <Image
                    src={work.leadImage.src}
                    alt={work.leadImage.alt}
                    fill
                    className={styles.caseLeadImg}
                    sizes={idx === 0 ? "(max-width: 960px) 100vw, 62vw" : "(max-width: 960px) 100vw, 36vw"}
                  />
                  <Image
                    src={work.detailImage.src}
                    alt=""
                    fill
                    className={styles.caseDetailImg}
                    sizes={idx === 0 ? "(max-width: 960px) 100vw, 62vw" : "(max-width: 960px) 100vw, 36vw"}
                  />
                  <div className={styles.caseBadges}>
                    <span>{work.index}</span>
                    <span>{work.stage}</span>
                  </div>
                  <span className={styles.caseHoverCue}>Hover for another view</span>
                </div>

                <div className={styles.caseBody}>
                  <p className={styles.caseCat}>{work.category}</p>
                  <div className={styles.caseTitleRow}>
                    <h3>{work.title}</h3>
                    <span className={styles.caseArrowBtn} aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <p className={styles.caseSummary}>{work.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03: Workshop vs Site Molten Wipe + 4-Step Process */}
      <WorkshopLiquidCompare />

      {/* SECTION 04: Surface & Alloy Specular Lab */}
      <AlloyFinishLab />

      {/* SECTION 05: Maison Project Register & Technical Journal */}
      <section
        id="liquid-register"
        className={styles.section}
        aria-labelledby="liquid-register-title"
      >
        <div className={styles.container}>
          <div className={styles.registerTop}>
            <div>
              <p className={styles.eyebrow}>05 · Global Luxury Retail Register · 2016–2026</p>
              <h2 id="liquid-register-title" className={styles.sectionTitle}>
                Destinations cast <span className={styles.displayItalic}>across cities.</span>
              </h2>
            </div>
            <div className={styles.filterGroup} role="group" aria-label="Filter project register by region">
              {REGION_FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={region === item}
                  className={`${styles.pillTab} ${region === item ? styles.pillTabActive : ""}`}
                  onClick={() => {
                    setRegion(item);
                    setShowAllRecords(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <ul className={styles.brandStrip} aria-label="Luxury maisons represented in project register">
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

          <div className={styles.ledger}>
            {visibleRecords.map((rec) => (
              <div key={rec.id} className={styles.ledgerRow}>
                <span className={styles.ledgerPeriod}>{rec.period}</span>
                <strong className={styles.ledgerBrand}>{rec.brand}</strong>
                <span className={styles.ledgerPlace}>
                  {rec.place}
                  {rec.scope ? ` · ${rec.scope}` : ""}
                </span>
                <span className={styles.ledgerCity}>{rec.location}</span>
              </div>
            ))}
          </div>

          {filteredRecords.length > 6 && (
            <div className={styles.ledgerFooter}>
              <button
                type="button"
                className={styles.outlineCta}
                onClick={() => setShowAllRecords((v) => !v)}
              >
                {showAllRecords
                  ? "Show fewer records"
                  : `View all ${filteredRecords.length} project records`}
              </button>
              <span className={styles.registerNote}>
                Selected project experience from Guoyao Metal’s 2016–2026 fabrication archive.
              </span>
            </div>
          )}

          <Link href={FEATURED_ARTICLE.href} className={styles.journalCard} onPointerMove={trackCardSheen}>
            <div className={styles.journalMedia}>
              <Image
                src={FEATURED_ARTICLE.image.src}
                alt={FEATURED_ARTICLE.image.alt}
                fill
                sizes="(max-width: 820px) 100vw, 34vw"
              />
            </div>
            <div className={styles.journalBody}>
              <span className={styles.eyebrow}>{FEATURED_ARTICLE.kicker}</span>
              <h3>{FEATURED_ARTICLE.title}</h3>
              <p>{FEATURED_ARTICLE.summary}</p>
              <span className={styles.inlineLink}>
                Read technical guide <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <footer id="liquid-contact" className={styles.footer}>
        <div className={`${styles.footerCanvasWrap} ${alloyStyles.footerStage}`}>
          <FoldedAlloyCanvas className={`${styles.liquidCanvas} ${alloyStyles.canvas} ${alloyStyles.footerCanvas}`} placement="footer" />
          <EmberField className={styles.emberCanvas} density={18} />
          <div className={alloyStyles.footerShade} aria-hidden="true" />
        </div>

        <div className={`${styles.container} ${styles.footerInner}`}>
          <div className={styles.footerCard}>
            <div className={styles.footerMain}>
              <p className={styles.eyebrow}>Start a Fabrication Brief</p>
              <h2>
                Send your drawings. <span className={styles.displayItalic}>We’ll shape the alloy.</span>
              </h2>
              <p className={styles.footerLead}>
                Share architectural plans, surface samples, or concept Rhino models with our Guangzhou engineering team for technical feasibility and sample quoting.
              </p>
              <div className={styles.heroActions}>
                <InquiryButton className={styles.moltenCtaLg}>
                  Discuss Your Project <ArrowUpRight size={17} aria-hidden="true" />
                </InquiryButton>
                <a href={`mailto:${SALES_EMAIL}`} className={styles.outlineCta}>
                  {SALES_EMAIL}
                </a>
              </div>
            </div>

            <div className={styles.checklistBox}>
              <h3>Recommended Brief Package</h3>
              <ul>
                {BRIEF_CHECKLIST.map((item) => (
                  <li key={item.num}>
                    <span>{item.num}</span>
                    <p>{item.label}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`${styles.footerBottom} ${alloyStyles.footerBottom}`}>
            <a href="#liquid-home" className={styles.brand}>
              <span className={styles.brandOrb} aria-hidden="true" />
              <span>GUOYAO</span>
              <span className={styles.brandSub}>METAL</span>
            </a>
            <div className={`${styles.footerLinks} ${alloyStyles.footerLinks}`}>
              <Link href="/case-studies">Case Studies</Link>
              <Link href="/blog">Technical Journal</Link>
              <Link href="/about">About Guoyao</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
