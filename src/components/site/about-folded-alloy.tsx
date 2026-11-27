"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Layers,
  Menu,
  ShieldCheck,
  Sparkles,
  Wrench,
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
  REDESIGN_IMAGES,
  projectBrands,
  projectRecords,
} from "@/data/homepage-redesign-data";
import { PRIMARY_NAVIGATION, SALES_EMAIL } from "@/lib/site-identity";
import { EmberField } from "@/components/site/home-styles/style-10-liquid-effects";
import { FoldedAlloyCanvas } from "@/components/site/home-styles/style-13-folded-alloy-canvas";
import mirror from "@/components/site/home-styles/style-10-liquid.module.css";
import alloyStyles from "@/components/site/home-styles/style-13-folded-alloy.module.css";
import styles from "@/app/(site)/about/about.module.css";

const REGION_FILTERS = ["All", "Greater China", "International"] as const;
type RegionFilter = (typeof REGION_FILTERS)[number];

const INTERNATIONAL_LOCATIONS = new Set(["United States", "Australia", "Delhi"]);

const WORKSHOP_STAGES = [
  {
    id: "drawings",
    num: "01",
    shortLabel: "Drawings & Samples",
    title: "Drawings & Reference Samples",
    subtitle: "Site geometry, shop drawings & signed finish coupons",
    description:
      "Every project starts by resolving site dimensions, concealed fixing paths, and panel divisions into buildable shop drawings alongside an approved physical finish sample.",
    checkpoint: "Shop drawings, structural nodes, and master finish coupon aligned before cutting begins.",
    tone: "#9eb4cc",
    image: REDESIGN_IMAGES.cartierSubstructure,
    caption: "Structural steel facade subframes verified on the workshop floor",
  },
  {
    id: "forming",
    num: "02",
    shortLabel: "Forming & Fabrication",
    title: "Forming & Subframe Fabrication",
    subtitle: "Rolling, pressing, TIG welding & compound curvature",
    description:
      "Stainless steel, brass, and bronze sheets are rolled, pressed, and welded onto dedicated structural frames so complex curves stay rigid and shadow gaps hold straight.",
    checkpoint: "Compound-curved profiles checked against fabrication templates during forming.",
    tone: "#d6ad72",
    image: REDESIGN_IMAGES.escalatorRibsMacro,
    caption: "Precision-formed compound-curved fluted panels on a fabrication bench",
  },
  {
    id: "assembly",
    num: "03",
    shortLabel: "1:1 Trial Assembly",
    title: "Full-Scale 1:1 Trial Assembly",
    subtitle: "Dry-fit portals, columns & balustrades on workshop jigs",
    description:
      "We erect full entrances, column enclosures, and curved stair assemblies in our Guangzhou workshop so curves, mitered nodes, and seams are proved before packing.",
    checkpoint: "Full-scale alignment, seam continuity, and site-interface fit verified while accessible.",
    tone: "#c7d1de",
    image: REDESIGN_IMAGES.pavilionTrialAssembly,
    caption: "Elliptical retail entrance framework pre-assembled at full scale",
  },
  {
    id: "finishing",
    num: "04",
    shortLabel: "Finish & Export Crating",
    title: "Finish Review & Export Crating",
    subtitle: "Grazing-light inspection, lighting tests & coded crating",
    description:
      "Each assembly is inspected against the reference sample under controlled lighting, integrated lighting is tested where specified, and every part is labeled and crated for shipment.",
    checkpoint: "Surface grain checked to approved sample, parts coded to drawings, and export-protected.",
    tone: "#b99a64",
    image: REDESIGN_IMAGES.hammeredVitrineLit,
    caption: "Illuminated hammered antique brass vitrine tested prior to export crating",
  },
] as const;

const DISPATCH_CHECKS = [
  {
    num: "01",
    icon: Compass,
    title: "Structural Fit & Site Interfaces",
    text: "Adjoining panels, concealed subframes, and site fixing interfaces checked together during 1:1 trial assembly.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "Finish Against Reference Master",
    text: "Brushed grain direction, tone, patination, and specular sheen compared side-by-side with the approved sample.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Part Coding & Protected Transport",
    text: "Every component labeled to match installation drawings and packed in custom-protected export crates.",
  },
] as const;

const TEAM_DISCIPLINES = [
  {
    num: "01",
    role: "Project Design",
    kicker: "Architectural Coordination",
    image: REDESIGN_IMAGES.cartierIvoryGoldFront,
    caption: "Elevation rhythm & layered metallic profiles",
    text: "Works with architects, brand teams, and contractors to resolve visible profiles, panel rhythms, illumination edges, and alloy pairings.",
    deliverables: ["Profile coordination", "Panel divisions", "Material pairing"],
  },
  {
    num: "02",
    role: "Fabrication Engineering",
    kicker: "Geometry & Connections",
    image: REDESIGN_IMAGES.lancomeJointDetail,
    caption: "Concealed structural nodes & mitered junctions",
    text: "Develops buildable shop drawings, internal steel subframes, and connection tolerances for compound-curved panels and multi-part portals.",
    deliverables: ["Shop drawings", "Subframe nodes", "1:1 trial jigs"],
  },
  {
    num: "03",
    role: "Surface Finishing",
    kicker: "Grain & Specular Control",
    image: REDESIGN_IMAGES.murrayColumnSeam,
    caption: "Hairline seam continuity across curved satin steel",
    text: "Prepares physical finish coupons and controls directional brushing, mirror polishing, and hand-worked patinas so light reads evenly across seams.",
    deliverables: ["Finish coupons", "Directional grain", "Grazing-light QC"],
  },
] as const;

const MANIFESTO_PILLARS = [
  {
    label: "Form",
    detail: "Compound curves and sweeping lines resolved in shop geometry before metal is cut.",
  },
  {
    label: "Surface",
    detail: "Grain, brushed sheen, and warm alloy tone held consistently from coupon to full elevation.",
  },
  {
    label: "Connection",
    detail: "Hairline seams and concealed subframes trial-fitted at 1:1 so site installation stays predictable.",
  },
] as const;

const APPLICATIONS = [
  {
    num: "01",
    tag: "Facades",
    title: "Storefronts & Entrances",
    leadImage: REDESIGN_IMAGES.cartierNightLattice,
    detailImage: REDESIGN_IMAGES.cartierSubstructure,
    text: "Backlit geometric lattices, reflective boutique elevations, and sculpted entrance portals engineered with concealed steel subframes.",
    specs: ["Backlit metal lattices", "Reflective facades", "Concealed subframes"],
    inquiry: "Storefront and entrance metalwork",
  },
  {
    num: "02",
    tag: "Cladding",
    title: "Curved Architectural Cladding",
    leadImage: REDESIGN_IMAGES.escalatorInstalledSoffit,
    detailImage: REDESIGN_IMAGES.escalatorPodWorkshop,
    text: "Compound-curved column enclosures, fluted escalator soffits, and sculptural atrium skins trial-assembled on workshop steel jigs.",
    specs: ["Double-curved panels", "Fluted soffits", "Hairline seams"],
    inquiry: "Curved architectural cladding",
  },
  {
    num: "03",
    tag: "Stairs",
    title: "Stairs & Balustrades",
    leadImage: REDESIGN_IMAGES.stairSpiralOverhead,
    detailImage: REDESIGN_IMAGES.wynnStairWorkshop,
    text: "Helical balustrades, continuous rolled handrail curves, and architectural bronze or stainless transitions pre-fitted for smooth sweep.",
    specs: ["Rolled handrails", "Curved balustrades", "Full dry-fit checks"],
    inquiry: "Stair balustrades and handrails",
  },
  {
    num: "04",
    tag: "Fixtures",
    title: "Display Vitrines & Fixtures",
    leadImage: REDESIGN_IMAGES.hammeredVitrineLit,
    detailImage: REDESIGN_IMAGES.flutedBrassCounter,
    text: "Fluted champagne-brass counters, hand-hammered antique brass vitrines, and illuminated display joinery built for luxury presentation.",
    specs: ["Fluted & hammered brass", "Integrated lighting", "Precision glass miters"],
    inquiry: "Metal display cabinets and fixtures",
  },
] as const;

const SELECTED_STORIES = [
  {
    slug: "/case-studies/backlit-fluted-metal-boutique-facade",
    index: "01",
    category: "Storefronts & Facades",
    title: "Backlit Fluted Metal Storefront",
    summary:
      "Folded silver profiles and integrated lighting documented in workshop trials and installed views of the retail corner.",
    stage: "Installed view",
    leadImage: REDESIGN_IMAGES.backlitFacadeTwilight,
    detailImage: REDESIGN_IMAGES.backlitFacadeWindowDetail,
  },
  {
    slug: "/case-studies/murray-road-column-cladding",
    index: "02",
    category: "Curved Cladding",
    title: "Murray Road Column Cladding",
    summary:
      "Double-curved satin stainless steel panels stood upright and trial-assembled at full scale to prove hairline seam continuity.",
    stage: "Workshop pre-assembly",
    leadImage: REDESIGN_IMAGES.murrayColumnFull,
    detailImage: REDESIGN_IMAGES.murrayColumnSeam,
  },
  {
    slug: "/case-studies/elliptical-curved-metal-entrance-pavilion",
    index: "03",
    category: "Storefronts & Facades",
    title: "Elliptical Entrance Pavilion",
    summary:
      "A full-scale workshop trial of the rolled oval ring, paired uprights, fascia joints and curved base.",
    stage: "Workshop pre-assembly",
    leadImage: REDESIGN_IMAGES.pavilionTrialAssembly,
    detailImage: REDESIGN_IMAGES.pavilionFasciaJoint,
  },
] as const;

function trackCardSheen(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

export function AboutFoldedAlloy() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [region, setRegion] = useState<RegionFilter>("All");
  const [showAllRecords, setShowAllRecords] = useState(false);
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
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    const dialogIsOpen = () => document.querySelector("dialog[open]") !== null;
    const closeOnOutsidePress = (event: globalThis.PointerEvent) => {
      if (dialogIsOpen()) return;
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
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

  const activeStage = WORKSHOP_STAGES[stageIndex];

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
      id="about-top"
      className={`${mirror.page} ${alloyStyles.home} ${styles.about}`}
      data-alloy-shell="about"
    >
      <div
        className={mirror.scrollTrack}
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <header ref={headerRef} className={`${mirror.header} ${alloyStyles.navigationHeader}`}>
        <div className={mirror.headerInner}>
          <Link
            href="/"
            className={mirror.brand}
            aria-label="Guoyao Metal, home"
            onClick={() => setMenuOpen(false)}
          >
            <span className={mirror.brandOrb} aria-hidden="true" />
            <span>GUOYAO</span>
            <span className={mirror.brandSub}>METAL</span>
          </Link>

          <nav className={`${mirror.nav} ${alloyStyles.primaryNav}`} aria-label="Primary navigation">
            {PRIMARY_NAVIGATION.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={href === "/about" ? "page" : undefined}>
                {label}
              </Link>
            ))}
          </nav>

          <div className={mirror.headerRight}>
            <HeaderContactBar />
            <InquiryButton className={`${mirror.moltenCta} ${alloyStyles.desktopInquiry}`}>
              Start a Project <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
            <button
              type="button"
              ref={menuButtonRef}
              className={`${mirror.menuBtn} ${alloyStyles.menuToggle}`}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="about-mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              Menu
            </button>
          </div>
        </div>

        <nav
          id="about-mobile-nav"
          className={`${mirror.mobileNav} ${alloyStyles.mobileMenu}`}
          hidden={!menuOpen}
          aria-label="Mobile navigation"
        >
          {PRIMARY_NAVIGATION.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={href === "/about" ? "page" : undefined}
              onNavigate={() => {
                if (href === "/about") menuButtonRef.current?.focus();
                setMenuOpen(false);
              }}
            >
              {label}
            </Link>
          ))}
          <InquiryButton className={mirror.moltenCta}>
            Start a Project <ArrowUpRight size={15} aria-hidden="true" />
          </InquiryButton>
        </nav>
      </header>
      {/* HERO: Atmospheric Folded Alloy + Workshop Proof Plate */}
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={mirror.heroCanvasWrap}>
          <FoldedAlloyCanvas className={`${mirror.liquidCanvas} ${alloyStyles.canvas}`} />
          <EmberField className={mirror.emberCanvas} density={44} />
          <div className={styles.heroScrim} aria-hidden="true" />
        </div>

        <div className={`${mirror.container} ${styles.heroInner}`}>
          <div className={mirror.heroTopRow}>
            <span className={mirror.statusChip}>
              <span className={mirror.liveDot} aria-hidden="true" />
              About Guoyao Metal · Guangzhou Workshop
            </span>
            <span className={mirror.interactPrompt}>
              1:1 Full-Scale Pre-Assembly · Custom Architectural Metalwork
            </span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1 id="about-title" className={styles.heroTitle}>
                <span className={mirror.chromeText}>The workshop</span>
                <span className={mirror.heroItalic}>behind every seam.</span>
              </h1>
              <p className={styles.heroLead}>
                We engineer, form, finish, and trial-assemble custom architectural metalwork in
                Guangdong for luxury retail, hospitality, and residential destinations—verifying
                curves, joints, and finishes at full scale before a single crate leaves our floor.
              </p>
              <div className={mirror.heroActions}>
                <InquiryButton className={mirror.moltenCtaLg}>
                  Discuss Your Project <ArrowUpRight size={17} aria-hidden="true" />
                </InquiryButton>
                <a href="#workshop" className={mirror.outlineCta}>
                  Inside the Workshop <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
            </div>

            <figure className={styles.heroPlate} onPointerMove={trackCardSheen}>
              <div className={styles.heroPlateMedia}>
                <Image
                  src={REDESIGN_IMAGES.escalatorPodWorkshop.src}
                  alt={REDESIGN_IMAGES.escalatorPodWorkshop.alt}
                  fill
                  fetchPriority="high"
                  loading="eager"
                  className={styles.plateLeadImg}
                  sizes="(max-width: 960px) 92vw, (max-width: 1440px) 58vw, 820px"
                />
                <Image
                  src={REDESIGN_IMAGES.escalatorRibsMacro.src}
                  alt=""
                  fill
                  className={styles.plateDetailImg}
                  sizes="(max-width: 960px) 92vw, (max-width: 1440px) 58vw, 820px"
                />
                <div className={styles.plateBadges}>
                  <span>{REDESIGN_IMAGES.escalatorPodWorkshop.stage}</span>
                  <span>Guangzhou Floor</span>
                </div>
                <span className={styles.plateHoverCue}>Hover for ribbed surface macro</span>
              </div>
              <figcaption className={styles.heroPlateCaption}>
                <div>
                  <strong>Compound-Curved Escalator Cladding</strong>
                  <span>Trial-fitted on steel workshop jigs prior to site dispatch</span>
                </div>
                <span className={styles.plateIndex}>1:1 JIG</span>
              </figcaption>
            </figure>
          </div>

          <dl className={mirror.heroTelemetry} aria-label="Workshop profile at a glance">
            <div className={mirror.telemetryCell}>
              <dt className={styles.telemetryTerm}>Workshop Base</dt>
              <dd className={styles.telemetryVal}>Guangzhou, Guangdong, China</dd>
            </div>
            <div className={mirror.telemetryCell}>
              <dt className={styles.telemetryTerm}>Core Alloys</dt>
              <dd className={styles.telemetryVal}>Stainless Steel · Brass · Bronze · Glass</dd>
            </div>
            <div className={mirror.telemetryCell}>
              <dt className={styles.telemetryTerm}>Verification Protocol</dt>
              <dd className={styles.telemetryVal}>1:1 Full-Scale Workshop Trial Assembly</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* SECTION 01: Interactive 4-Stage Workshop Protocol */}
      <section id="workshop" className={`${mirror.section} ${styles.workshopSection}`} aria-labelledby="workshop-title">
        <div className={mirror.container}>
          <div className={mirror.sectionHeader}>
            <div>
              <p className={mirror.eyebrow}>
                <Wrench size={13} aria-hidden="true" /> 01 · Workshop Protocol
              </p>
              <h2 id="workshop-title" className={mirror.sectionTitle}>
                Made to fit <span className={mirror.displayItalic}>before it leaves the floor.</span>
              </h2>
            </div>
            <p className={mirror.sectionIntro}>
              A full-scale trial assembly lets our engineers and clients inspect curves, shadow
              gaps, and surface continuity while every joint is still accessible on the shop floor.
            </p>
          </div>

          <div
            className={styles.protocolShell}
            style={{ "--protocol-tone": activeStage.tone } as CSSProperties}
          >
            <div className={styles.protocolGlow} aria-hidden="true" />

            <div
              className={styles.stageTabs}
              role="tablist"
              aria-label="Workshop fabrication stages"
            >
              {WORKSHOP_STAGES.map((stage, idx) => {
                const isActive = idx === stageIndex;
                return (
                  <button
                    key={stage.id}
                    id={`stage-tab-${stage.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`stage-panel-${stage.id}`}
                    className={`${styles.stageTab} ${isActive ? styles.stageTabActive : ""}`}
                    onClick={() => setStageIndex(idx)}
                  >
                    <span className={styles.stageNum}>{stage.num}</span>
                    <span className={styles.stageTabText}>
                      <strong>{stage.title}</strong>
                      <small>{stage.subtitle}</small>
                    </span>
                    <ArrowUpRight size={15} className={styles.stageArrow} aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <figure
              id={`stage-panel-${activeStage.id}`}
              role="tabpanel"
              aria-labelledby={`stage-tab-${activeStage.id}`}
              className={styles.stageShowcase}
            >
              <div className={styles.stageMedia}>
                <Image
                  key={activeStage.image.src}
                  src={activeStage.image.src}
                  alt={activeStage.image.alt}
                  fill
                  sizes="(max-width: 960px) 92vw, 54vw"
                />
                <span className={styles.stagePill}>
                  Stage {activeStage.num} · {activeStage.image.stage}
                </span>
              </div>
              <figcaption className={styles.stageReadout}>
                <div className={styles.stageReadoutHead}>
                  <strong>{activeStage.title}</strong>
                  <span>{activeStage.caption}</span>
                </div>
                <p>{activeStage.description}</p>
                <div className={styles.stageCheck}>
                  <CheckCircle2 size={15} aria-hidden="true" />
                  <span>{activeStage.checkpoint}</span>
                </div>
              </figcaption>
            </figure>
          </div>

          <div id="why-guoyao" className={styles.dispatchWrap}>
            <div className={styles.dispatchHead}>
              <span className={styles.dispatchKicker}>Pre-Dispatch Verification</span>
              <h3>What we check before a single crate ships</h3>
            </div>
            <div className={styles.dispatchGrid}>
              {DISPATCH_CHECKS.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.num}
                    className={styles.dispatchCard}
                    onPointerMove={trackCardSheen}
                  >
                    <div className={styles.dispatchCardTop}>
                      <span className={styles.dispatchIcon} aria-hidden="true">
                        <Icon size={17} />
                      </span>
                      <span className={styles.dispatchNum}>{item.num}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: Specialist Disciplines & Architectural Ethos */}
      <section id="design-team" className={mirror.section} aria-labelledby="team-title">
        <div className={mirror.container}>
          <div className={mirror.sectionHeader}>
            <div>
              <p className={mirror.eyebrow}>
                <Sparkles size={13} aria-hidden="true" /> 02 · Studio &amp; Engineering Team
              </p>
              <h2 id="team-title" className={mirror.sectionTitle}>
                From design intent <span className={mirror.displayItalic}>to fabrication detail.</span>
              </h2>
            </div>
            <p className={mirror.sectionIntro}>
              Project designers, fabrication engineers, and surface specialists work through every
              brief together so geometry, concealed fixings, and finish never drift apart.
            </p>
          </div>

          <div className={styles.teamGrid}>
            {TEAM_DISCIPLINES.map((discipline) => (
              <article
                key={discipline.role}
                className={styles.teamCard}
                onPointerMove={trackCardSheen}
              >
                <div className={styles.teamMedia}>
                  <Image
                    src={discipline.image.src}
                    alt={discipline.image.alt}
                    fill
                    sizes="(max-width: 820px) 92vw, 31vw"
                  />
                  <span className={styles.teamBadge}>
                    {discipline.num} · {discipline.kicker}
                  </span>
                </div>
                <div className={styles.teamBody}>
                  <h3>{discipline.role}</h3>
                  <p>{discipline.text}</p>
                  <ul className={styles.deliverableList}>
                    {discipline.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.manifesto} aria-label="Workshop craft philosophy">
            <div className={styles.manifestoLead}>
              <p className={mirror.eyebrow}>Workshop Ethos</p>
              <p className={styles.manifestoQuote}>
                Form. <span className={mirror.displayItalic}>Surface.</span> Connection.
              </p>
            </div>
            <div className={styles.manifestoPillars}>
              {MANIFESTO_PILLARS.map((pillar) => (
                <div key={pillar.label} className={styles.manifestoPillar}>
                  <strong>{pillar.label}</strong>
                  <p>{pillar.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: What We Make (Dual-Image Crossfade Scope Matrix) */}
      <section id="what-we-make" className={mirror.section} aria-labelledby="make-title">
        <div className={mirror.container}>
          <div className={mirror.sectionHeader}>
            <div>
              <p className={mirror.eyebrow}>
                <Layers size={13} aria-hidden="true" /> 03 · Fabrication Scope
              </p>
              <h2 id="make-title" className={mirror.sectionTitle}>
                Four disciplines, <span className={mirror.displayItalic}>one standard of fit.</span>
              </h2>
            </div>
            <p className={mirror.sectionIntro}>
              From illuminated boutique storefronts to compound-curved columns, sculptural stairs,
              and hammered brass display vitrines.
            </p>
          </div>

          <div className={styles.scopeGrid}>
            {APPLICATIONS.map((app) => (
              <article
                key={app.title}
                className={styles.scopeCard}
                onPointerMove={trackCardSheen}
              >
                <div className={styles.scopeVisual}>
                  <Image
                    src={app.leadImage.src}
                    alt={app.leadImage.alt}
                    fill
                    className={styles.scopeLeadImg}
                    sizes="(max-width: 820px) 92vw, 48vw"
                  />
                  <Image
                    src={app.detailImage.src}
                    alt=""
                    fill
                    className={styles.scopeDetailImg}
                    sizes="(max-width: 820px) 92vw, 48vw"
                  />
                  <div className={mirror.caseBadges}>
                    <span>{app.num}</span>
                    <span>{app.leadImage.stage}</span>
                  </div>
                  <span className={styles.scopeHoverCue}>Hover for workshop view</span>
                </div>
                <div className={styles.scopeBody}>
                  <p className={mirror.caseCat}>{app.tag}</p>
                  <h3>{app.title}</h3>
                  <p className={styles.scopeText}>{app.text}</p>
                  <ul className={styles.scopeSpecs}>
                    {app.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                  <InquiryButton
                    className={`${mirror.glassCta} ${styles.scopeCta}`}
                    product={{ name: app.inquiry }}
                  >
                    Discuss {app.tag.toLowerCase()}
                    <span className="sr-only"> ({app.title})</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </InquiryButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 04: Selected Documented Case Studies (Asymmetric Wide + 2-Col) */}
      <section id="selected-stories" className={mirror.section} aria-labelledby="stories-title">
        <div className={mirror.container}>
          <div className={mirror.sectionHeader}>
            <div>
              <p className={mirror.eyebrow}>04 · Documented Works</p>
              <h2 id="stories-title" className={mirror.sectionTitle}>
                Selected project <span className={mirror.displayItalic}>case studies.</span>
              </h2>
            </div>
            <Link href="/case-studies" className={mirror.inlineLink}>
              Explore all case studies <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className={mirror.caseGrid}>
            {SELECTED_STORIES.map((work, idx) => (
              <Link
                key={work.slug}
                href={work.slug}
                className={`${mirror.caseCard} ${idx === 0 ? mirror.caseCardWide : ""}`}
                onPointerMove={trackCardSheen}
              >
                <div className={mirror.caseVisual}>
                  <Image
                    src={work.leadImage.src}
                    alt={work.leadImage.alt}
                    fill
                    className={mirror.caseLeadImg}
                    sizes={
                      idx === 0
                        ? "(max-width: 960px) 100vw, 62vw"
                        : "(max-width: 960px) 100vw, 36vw"
                    }
                  />
                  <Image
                    src={work.detailImage.src}
                    alt=""
                    fill
                    className={mirror.caseDetailImg}
                    sizes={
                      idx === 0
                        ? "(max-width: 960px) 100vw, 62vw"
                        : "(max-width: 960px) 100vw, 36vw"
                    }
                  />
                  <div className={mirror.caseBadges}>
                    <span>{work.index}</span>
                    <span>{work.stage}</span>
                  </div>
                  <span className={`${mirror.caseHoverCue} ${styles.hoverOnlyCue}`}>
                    Hover for seam detail
                  </span>
                </div>

                <div className={mirror.caseBody}>
                  <p className={mirror.caseCat}>{work.category}</p>
                  <div className={mirror.caseTitleRow}>
                    <h3>{work.title}</h3>
                    <span className={mirror.caseArrowBtn} aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <p className={mirror.caseSummary}>{work.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05: Global Luxury Retail Project Archive (2016–2026) */}
      <section id="project-experience" className={mirror.section} aria-labelledby="archive-title">
        <div className={mirror.container}>
          <div className={mirror.registerTop}>
            <div>
              <p className={mirror.eyebrow}>05 · Project Archive · 2016–2026</p>
              <h2 id="archive-title" className={mirror.sectionTitle}>
                Destinations built <span className={mirror.displayItalic}>across cities.</span>
              </h2>
            </div>
            <div
              className={mirror.filterGroup}
              role="group"
              aria-label="Filter project archive by region"
            >
              {REGION_FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={region === item}
                  className={`${mirror.pillTab} ${region === item ? mirror.pillTabActive : ""}`}
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

          <ul
            className={mirror.brandStrip}
            aria-label="Luxury maisons represented in project archive"
          >
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

          <div className={mirror.ledger}>
            {visibleRecords.map((rec) => (
              <div key={rec.id} className={mirror.ledgerRow}>
                <span className={mirror.ledgerPeriod}>{rec.period}</span>
                <strong className={mirror.ledgerBrand}>{rec.brand}</strong>
                <span className={mirror.ledgerPlace}>
                  {rec.place}
                  {rec.scope ? ` · ${rec.scope}` : ""}
                </span>
                <span className={mirror.ledgerCity}>{rec.location}</span>
              </div>
            ))}
          </div>

          {filteredRecords.length > 6 && (
            <div className={mirror.ledgerFooter}>
              <button
                type="button"
                className={mirror.outlineCta}
                onClick={() => setShowAllRecords((v) => !v)}
              >
                {showAllRecords
                  ? "Show fewer records"
                  : `View all ${filteredRecords.length} project records`}
              </button>
              <span className={mirror.registerNote}>
                Selected project experience from Guoyao Metal’s 2016–2026 archive. Brand names
                record fabrication experience, not direct endorsement.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* CLOSING BRIEF & FOOTER FINALE: Aligned 1:1 with Homepage */}
      <footer
        id="start-conversation"
        className={mirror.footer}
        aria-labelledby="brief-title"
      >
        <div className={`${mirror.footerCanvasWrap} ${alloyStyles.footerStage}`}>
          <FoldedAlloyCanvas
            className={`${mirror.liquidCanvas} ${alloyStyles.canvas} ${alloyStyles.footerCanvas}`}
            placement="footer"
          />
          <EmberField className={mirror.emberCanvas} density={18} />
          <div className={alloyStyles.footerShade} aria-hidden="true" />
        </div>

        <div className={`${mirror.container} ${mirror.footerInner}`}>
          <div className={mirror.footerCard}>
            <div className={mirror.footerMain}>
              <p className={mirror.eyebrow}>Start a Fabrication Brief</p>
              <h2 id="brief-title">
                Tell us what <span className={mirror.displayItalic}>you’re building.</span>
              </h2>
              <p className={mirror.footerLead}>
                Share architectural drawings, reference photography, approximate dimensions, and
                finish expectations with our Guangzhou engineering team for feasibility review and
                sample quoting.
              </p>
              <div className={mirror.heroActions}>
                <InquiryButton className={mirror.moltenCtaLg}>
                  Discuss Your Project <ArrowUpRight size={17} aria-hidden="true" />
                </InquiryButton>
                <a href={`mailto:${SALES_EMAIL}`} className={mirror.outlineCta}>
                  {SALES_EMAIL}
                </a>
              </div>
            </div>

            <div className={mirror.checklistBox}>
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

          <div className={`${mirror.footerBottom} ${alloyStyles.footerBottom}`}>
            <a href="#about-top" className={mirror.brand} aria-label="Guoyao Metal, back to top">
              <span className={mirror.brandOrb} aria-hidden="true" />
              <span>GUOYAO</span>
              <span className={mirror.brandSub}>METAL</span>
            </a>
            <div className={`${mirror.footerLinks} ${alloyStyles.footerLinks}`}>
              <Link href="/">Home</Link>
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
