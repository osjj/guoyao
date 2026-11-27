import { projectBrands, projectRecords } from "./project-experience";

export const REDESIGN_NAV = [
  { href: "/", label: "Home" },
  { href: "/case-studies", label: "Projects" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
] as const;

export const REDESIGN_IMAGES = {
  // Escalator & Architectural Cladding (S11 / S12)
  escalatorAtriumWide: {
    src: "/images/redesign/stage2-projects/escalator-atrium.webp",
    alt: "Symmetrical gold-toned ribbed metal cladding framing twin escalators in a marble atrium",
    stage: "Installed view",
    category: "Cladding",
  },
  escalatorAtriumTall: {
    src: "/images/redesign/escalator-atrium-tall.webp",
    alt: "Multi-level atrium escalators clad in sculpted champagne-gold metalwork",
    stage: "Installed view",
    category: "Cladding",
  },
  escalatorPortal: {
    src: "/images/redesign/escalator-portal.webp",
    alt: "Symmetrical fluted architectural metal portal flanking a luminous lobby passage",
    stage: "Installed view",
    category: "Cladding",
  },
  escalatorPodWorkshop: {
    src: "/images/redesign/stage2-projects/escalator-end-pod.webp",
    alt: "Champagne-bronze fluted escalator end pod supported at full scale in the workshop",
    stage: "Workshop pre-assembly",
    category: "Cladding",
  },
  escalatorRibsMacro: {
    src: "/images/redesign/escalator-ribs-macro.webp",
    alt: "Close-up of precision-formed compound-curved stainless steel fluted panels on a fabrication bench",
    stage: "Workshop detail",
    category: "Cladding",
  },
  escalatorInstalledSoffit: {
    src: "/images/redesign/escalator-installed-soffit.webp",
    alt: "Cantilevered curved champagne-gold ribbed metal escalator soffit installed in a retail atrium",
    stage: "Installed view",
    category: "Cladding",
  },

  // Cartier & Geometric Storefronts (S04 / S11)
  cartierNightLattice: {
    src: "/images/redesign/cartier-night-lattice.webp",
    alt: "Illuminated geometric architectural metal lattice across a Cartier flagship facade at night",
    stage: "Installed view",
    category: "Facades",
  },
  cartierIfsDay: {
    src: "/images/redesign/cartier-ifs-day.webp",
    alt: "Monumental multi-story geometric bronze metal facade photographed in daylight",
    stage: "Installed view",
    category: "Facades",
  },
  cartierGoldGlow: {
    src: "/images/redesign/cartier-gold-glow.webp",
    alt: "Warm amber-gold backlit architectural metal storefront grid glowing at night",
    stage: "Installed view",
    category: "Facades",
  },
  cartierIvoryGoldFront: {
    src: "/images/redesign/cartier-ivory-gold-front.webp",
    alt: "Sculpted white vertical architectural fins layered over textured champagne-gold metalwork",
    stage: "Installed view",
    category: "Facades",
  },
  cartierIvoryGoldAngle: {
    src: "/images/redesign/cartier-ivory-gold-angle.webp",
    alt: "Three-quarter elevation of a sculpted ivory-and-gold retail storefront facade",
    stage: "Installed view",
    category: "Facades",
  },
  cartierSubstructure: {
    src: "/images/redesign/cartier-substructure.webp",
    alt: "Precision-welded structural steel facade subframes inspected on the workshop floor",
    stage: "Workshop fabrication",
    category: "Workshop",
  },

  // Tiffany & Reflective Facades (S10 / S11)
  tiffanyTwilightFacade: {
    src: "/images/redesign/tiffany-twilight-facade.webp",
    alt: "Tiffany & Co. storefront with illuminated crystal-textured metal framing at dusk",
    stage: "Installed view",
    category: "Facades",
  },
  tiffanyTwilightCorner: {
    src: "/images/redesign/tiffany-twilight-corner.webp",
    alt: "Architectural corner view of an illuminated textured metal boutique facade at twilight",
    stage: "Installed view",
    category: "Facades",
  },
  tiffanyCurvedBlue: {
    src: "/images/redesign/tiffany-curved-blue.webp",
    alt: "Curved boutique facade with blue backlit textured metal panels during site work",
    stage: "On-site view",
    category: "Facades",
  },
  tiffanyFrontPanoramic: {
    src: "/images/redesign/tiffany-front-panoramic.webp",
    alt: "Full front elevation of a reflective metal Tiffany & Co. boutique facade",
    stage: "Installed view",
    category: "Facades",
  },
  tiffanyCornerPanoramic: {
    src: "/images/redesign/tiffany-corner-panoramic.webp",
    alt: "Corner wrap of the reflective metal cladding system on a Tiffany & Co. boutique",
    stage: "Installed view",
    category: "Facades",
  },
  tiffanyCrystalEntry: {
    src: "/images/redesign/tiffany-crystal-entry.webp",
    alt: "Shimmering vertical metal-rod crystal facade wrapping a Tiffany & Co. boutique entry",
    stage: "Installed view",
    category: "Facades",
  },
  backlitFacadeTwilight: {
    src: "/images/redesign/stage2-projects/backlit-facade-twilight.webp",
    alt: "Illuminated fluted metal facade wrapping around a retail corner at dusk",
    stage: "Installed view",
    category: "Facades",
  },
  backlitFacadeWindowDetail: {
    src: "/images/redesign/stage2-projects/backlit-facade-window-detail.webp",
    alt: "Backlit silver facade panels framing the glazed display openings",
    stage: "Installed detail",
    category: "Facades",
  },

  // Staircases & Balustrades (S08 / S09 / S13)
  stairSpiralOverhead: {
    src: "/images/redesign/stage2-projects/stair-overhead.webp",
    alt: "Overhead spiral perspective of a curved metal balustrade and sweeping dark handrail during site installation",
    stage: "Site installation",
    category: "Stairs",
  },
  stairElevation: {
    src: "/images/redesign/stage2-projects/stair-elevation.webp",
    alt: "Sweeping curved staircase with mirror-finished balusters and a dark handrail",
    stage: "Site installation",
    category: "Stairs",
  },
  stairSiteFrame: {
    src: "/images/redesign/stair-site-frame.webp",
    alt: "Curved structural steel staircase carcass erected on site with scaffolding",
    stage: "Site structure",
    category: "Stairs",
  },
  wynnStairWorkshop: {
    src: "/images/redesign/wynn-stair-workshop.webp",
    alt: "Full-scale curved staircase balustrade frame pre-assembled in the workshop for dimensional check",
    stage: "Workshop pre-assembly",
    category: "Stairs",
  },
  wynnHandrailCurves: {
    src: "/images/redesign/wynn-handrail-curves.webp",
    alt: "Precision-rolled curved metal handrail segments laid out before polishing",
    stage: "Workshop detail",
    category: "Stairs",
  },
  taikooBalustrade: {
    src: "/images/redesign/taikoo-balustrade.webp",
    alt: "Long-span curved brushed stainless steel balustrade assembly aligned on the workshop floor",
    stage: "Workshop pre-assembly",
    category: "Stairs",
  },

  // Sculptural Column Cladding (S15)
  murrayColumnFull: {
    src: "/images/redesign/murray-column-full.webp",
    alt: "Tall sculptural satin stainless steel column cladding stood upright for workshop pre-assembly",
    stage: "Workshop pre-assembly",
    category: "Cladding",
  },
  murrayColumnSeam: {
    src: "/images/redesign/murray-column-seam.webp",
    alt: "Close-up of a double-curved satin stainless steel column seam showing hairline joint alignment",
    stage: "Surface & seam detail",
    category: "Cladding",
  },
  murrayColumnPanels: {
    src: "/images/redesign/murray-column-panels.webp",
    alt: "Individual formed curved steel cladding panels staged prior to trial assembly",
    stage: "Workshop fabrication",
    category: "Cladding",
  },

  // Entrance Pavilion & Retail Fixtures (S03 / S05 / S07)
  lancomeFrameFull: {
    src: "/images/redesign/lancome-frame-full.webp",
    alt: "Cylindrical curved retail entrance pavilion structure pre-assembled in the workshop",
    stage: "Workshop pre-assembly",
    category: "Facades",
  },
  lancomeJointDetail: {
    src: "/images/redesign/lancome-joint-detail.webp",
    alt: "Close-up of concealed structural connections and mitered nodes on a curved entrance frame",
    stage: "Connection detail",
    category: "Workshop",
  },
  pavilionTrialAssembly: {
    src: "/images/redesign/stage2-projects/pavilion-trial-assembly.webp",
    alt: "Elliptical metal entrance pavilion with paired posts and an overhead ring during workshop trial assembly",
    stage: "Workshop pre-assembly",
    category: "Facades",
  },
  pavilionFasciaJoint: {
    src: "/images/redesign/stage2-projects/pavilion-fascia-joint.webp",
    alt: "Return joint between adjoining metal fascia faces on the retail pavilion",
    stage: "Connection detail",
    category: "Workshop",
  },
  flutedBrassCounter: {
    src: "/images/redesign/fluted-brass-counter.webp",
    alt: "Curved fluted champagne-brass display counter photographed in workshop finishing",
    stage: "Workshop view",
    category: "Displays",
  },
  hammeredBrassVitrine: {
    src: "/images/redesign/hammered-brass-vitrine.webp",
    alt: "Hand-hammered antique brass display vitrine frame showing tactile metal relief and glass miter",
    stage: "Workshop detail",
    category: "Displays",
  },
  hammeredVitrineLit: {
    src: "/images/redesign/hammered-vitrine-lit.webp",
    alt: "Illuminated hammered antique brass display vitrine tested with integrated warm lighting",
    stage: "Workshop lighting test",
    category: "Displays",
  },
} as const;

export const DISCIPLINES = [
  {
    id: "facades",
    href: "/capabilities/storefront-facades",
    index: "01",
    title: "Storefronts & Facades",
    shortTitle: "Facades",
    subtitle: "Backlit lattices, reflective envelopes & sculpted retail portals",
    description:
      "Full-height boutique facades, illuminated metal modules, and structural steel subframes engineered for exact sightlines and repeat reflection.",
    inquiry: "storefront and entrance metalwork",
    primaryImage: REDESIGN_IMAGES.cartierNightLattice,
    secondaryImage: REDESIGN_IMAGES.cartierSubstructure,
    specs: ["Backlit modular lattices", "Mirror & textured stainless", "Concealed steel subframes"],
  },
  {
    id: "cladding",
    href: "/capabilities/curved-architectural-cladding",
    index: "02",
    title: "Curved Architectural Cladding",
    shortTitle: "Cladding",
    subtitle: "Double-curved columns, fluted escalator skins & soffits",
    description:
      "Compound-curved column enclosures and sculptural atrium cladding formed, trial-assembled in full scale, and hairline-aligned before dispatch.",
    inquiry: "curved architectural metal cladding",
    primaryImage: REDESIGN_IMAGES.escalatorAtriumWide,
    secondaryImage: REDESIGN_IMAGES.murrayColumnSeam,
    specs: ["Compound-curved forming", "Full-scale workshop mockups", "Hairline panel joints"],
  },
  {
    id: "stairs",
    href: "/capabilities/custom-staircases-balustrades",
    index: "03",
    title: "Stairs & Balustrades",
    shortTitle: "Stairs",
    subtitle: "Helical handrails, curved stair carcasses & bronze rails",
    description:
      "Sweeping sculptural staircases, continuous rolled handrail profiles, and long-span stainless balustrades pre-fitted to guarantee smooth curvature on site.",
    inquiry: "stair balustrades and handrails",
    primaryImage: REDESIGN_IMAGES.stairSpiralOverhead,
    secondaryImage: REDESIGN_IMAGES.wynnStairWorkshop,
    specs: ["Helical rolled handrails", "Full trial assembly", "Architectural bronze & steel"],
  },
  {
    id: "displays",
    href: "/capabilities/display-vitrines-hospitality-ffe",
    index: "04",
    title: "Display Vitrines & Fixtures",
    shortTitle: "Displays",
    subtitle: "Fluted brass counters, hammered vitrines & illuminated walls",
    description:
      "Bespoke freestanding counters, jewelry display cases, and tactile hospitality fixtures integrating concealed illumination and precision glass joints.",
    inquiry: "metal display cabinets and retail fixtures",
    primaryImage: REDESIGN_IMAGES.flutedBrassCounter,
    secondaryImage: REDESIGN_IMAGES.hammeredVitrineLit,
    specs: ["Fluted & hammered brass", "Integrated warm lighting", "Precision glass joinery"],
  },
] as const;

export const FEATURED_CASE_STUDIES = [
  {
    slug: "/case-studies/curved-fluted-escalator-atrium-cladding",
    index: "01",
    category: "Curved Cladding",
    title: "Double-Curved Fluted Escalator Cladding",
    summary:
      "Champagne-bronze fluted casings photographed during full-scale fit-up and after installation across a multi-level atrium.",
    stage: "Installed view",
    leadImage: REDESIGN_IMAGES.escalatorAtriumWide,
    detailImage: REDESIGN_IMAGES.escalatorPodWorkshop,
  },
  {
    slug: "/case-studies/helical-metal-feature-staircase",
    index: "02",
    category: "Stairs & Balustrades",
    title: "Helical Metal Feature Staircase",
    summary:
      "Curved structural steel, mirror-finished balusters and a continuous dark handrail documented through site fit-out.",
    stage: "Near-completion site view",
    leadImage: REDESIGN_IMAGES.stairSpiralOverhead,
    detailImage: REDESIGN_IMAGES.stairElevation,
  },
  {
    slug: "/case-studies/backlit-fluted-metal-boutique-facade",
    index: "03",
    category: "Storefronts & Facades",
    title: "Backlit Fluted Metal Storefront",
    summary:
      "Folded silver profiles and prismatic facing wrap a retail corner, with a workshop fit-up and lighting checks alongside installed views.",
    stage: "Installed view",
    leadImage: REDESIGN_IMAGES.backlitFacadeTwilight,
    detailImage: REDESIGN_IMAGES.backlitFacadeWindowDetail,
  },
] as const;

export const SURFACE_FINISHES = [
  {
    id: "satin-steel",
    code: "FN-01",
    name: "Directional Satin Stainless",
    tone: "#C5C8CC",
    image: REDESIGN_IMAGES.murrayColumnSeam,
    caption: "Double-curved seam alignment / Satin brushed stainless steel",
    note: "Uniform directional grain engineered to hold clean tonal continuity across compound curves and panel divisions.",
  },
  {
    id: "fluted-champagne",
    code: "FN-02",
    name: "Fluted Champagne Brass",
    tone: "#B99A64",
    image: REDESIGN_IMAGES.flutedBrassCounter,
    caption: "Curved fluted counter / Brushed champagne-gold finish",
    note: "Rhythmic ribbed geometry catching grazing interior light with warm metallic depth across curved retail counters and atriums.",
  },
  {
    id: "hammered-bronze",
    code: "FN-03",
    name: "Hand-Hammered Antique Brass",
    tone: "#8D6E42",
    image: REDESIGN_IMAGES.hammeredBrassVitrine,
    caption: "Hammered vitrine corner / Tactile artisanal surface",
    note: "Hand-textured metallic relief paired with razor-sharp mitered edges for hospitality and high-jewelry vitrines.",
  },
  {
    id: "crystal-lattice",
    code: "FN-04",
    name: "Backlit Reflective Facade",
    tone: "#7D95A6",
    image: REDESIGN_IMAGES.tiffanyCrystalEntry,
    caption: "Shimmering vertical metal-rod facade / Installed view",
    note: "Layered metallic texture and concealed illumination creating a luminous architectural threshold day and night.",
  },
] as const;

export const WORKSHOP_TO_SITE_PAIRS = [
  {
    id: "escalator",
    label: "Sculpted Atrium Escalator Cladding",
    scope: "Compound-curved ribbed metallic cladding",
    installed: REDESIGN_IMAGES.escalatorAtriumWide,
    workshop: REDESIGN_IMAGES.escalatorPodWorkshop,
    metric: "Full 3D compound curvature trial-fitted on workshop steel jigs",
  },
  {
    id: "facade",
    label: "Geometric Backlit Retail Facade",
    scope: "Modular metal lattice & steel substructure",
    installed: REDESIGN_IMAGES.cartierNightLattice,
    workshop: REDESIGN_IMAGES.cartierSubstructure,
    metric: "Precision-welded structural subframes pre-checked before glazing",
  },
  {
    id: "stair",
    label: "Monumental Helical Staircase",
    scope: "Curved balustrade, rolled handrail & carcass",
    installed: REDESIGN_IMAGES.stairSpiralOverhead,
    workshop: REDESIGN_IMAGES.wynnStairWorkshop,
    metric: "Continuous sweeping geometry verified in full-scale assembly",
  },
] as const;

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Drawings & Engineering",
    detail: "Translating architectural intent, CAD/Rhino surfaces, and finish references into buildable shop drawings.",
    image: REDESIGN_IMAGES.cartierSubstructure,
  },
  {
    num: "02",
    title: "Forming & Fabrication",
    detail: "Rolling, pressing, and welding stainless steel, bronze, and brass to resolve compound curvature and tight junctions.",
    image: REDESIGN_IMAGES.escalatorRibsMacro,
  },
  {
    num: "03",
    title: "Full-Scale Pre-Assembly",
    detail: "Erecting full portals, columns, and staircases in our Guangzhou workshop so seams and profiles are verified before dispatch.",
    image: REDESIGN_IMAGES.murrayColumnFull,
  },
  {
    num: "04",
    title: "Finishing & Export Crating",
    detail: "Controlled brushing, mirror polishing, lighting checks, and custom protective crating for domestic and international sites.",
    image: REDESIGN_IMAGES.hammeredVitrineLit,
  },
] as const;

export type FeaturedArticle = {
  href: string;
  kicker: string;
  title: string;
  summary: string;
  image: { src: string; alt: string };
};

export const PREFERRED_FEATURED_ARTICLE_SLUG = "architectural-metal-finishes-brushed-mirror-hammered-pvd-guide";

export const FEATURED_ARTICLE = {
  href: "/blog/metalwork-welding-process-and-quality-control",
  kicker: "Technical Journal",
  title: "High-End Metalwork Welding & Quality Control",
  summary:
    "How to specify visible welds, match base metals and fillers, and check distortion and finishing on architectural metalwork.",
  image: {
    src: "https://media.guoyaometal.com/blog/metalwork-welding-process-and-quality-control/hero-cc4cc95d6eaf9f92.webp",
    alt: "Stainless steel sheet-metal workshop with welding in progress",
  },
} satisfies FeaturedArticle;

export const BRIEF_CHECKLIST = [
  { num: "01", label: "Project location & architectural application" },
  { num: "02", label: "CAD / PDF drawings & approximate dimensions" },
  { num: "03", label: "Finish references, quantities & target schedule" },
] as const;

export { projectBrands, projectRecords };
