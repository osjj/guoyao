export type EditorialKind = "blog" | "case-studies";
export type EditorialSeoInput = { slug: string; title: string; excerpt: string };
export type EditorialSeo = { title: string; description: string };

type CuratedEditorialSeo = EditorialSeo & { sourceTitle: string; sourceExcerpt: string };

// Curated summaries for case studies and reviewed blog posts.
// Source checks preserve later CMS edits.
const curatedEditorialSeo: Record<string, CuratedEditorialSeo> = {
  "case-studies/curved-fluted-escalator-atrium-cladding": {
    "sourceTitle": "Double-Curved Fluted Metal Escalator Cladding for a Multi-Level Atrium",
    "sourceExcerpt": "Champagne-bronze fluted metal cladding wraps the escalator undersides and rounded end pods of a multi-level retail atrium. Workshop and site photographs show the bare panels, the full-scale fit-up and the installed casings.",
    "title": "Double-Curved Fluted Metal Escalator Cladding",
    "description": "Explore double-curved fluted champagne-bronze escalator cladding fabricated and 1:1 trial-assembled in our workshop before multi-level atrium installation."
  },
  "case-studies/helical-metal-feature-staircase": {
    "sourceTitle": "Sculptural Helical Metal Staircase & Curved Balustrade Fabrication",
    "sourceExcerpt": "A commercial feature stair documented from curved steel erection to near-complete fit-out, with dark profiled handrails, mirror-finished stainless steel balusters and black stone treads.",
    "title": "Helical Metal Feature Staircase & Balustrade",
    "description": "See a helical metal staircase progress from curved steel erection to mirror-finished stainless steel balusters, dark curved handrails and stone treads."
  },
  "case-studies/luxury-hotel-lobby-brass-vitrines-ffe": {
    "sourceTitle": "Bespoke Hammered Brass Display Vitrines & Hotel Lobby FF&E Metalwork",
    "sourceExcerpt": "Workshop fabrication, dry-fit and lighting checks for hammered brass display vitrines, lacquered back-bar joinery and coordinating marble-topped lobby furniture.",
    "title": "Hotel Lobby Brass Display Vitrines & FF&E",
    "description": "Hammered brass display vitrines, marble-top consoles and lacquered back-bar joinery, documented through workshop dry-fit and lighting checks."
  },
  "case-studies/murray-road-column-cladding": {
    "sourceTitle": "Double-Curved Satin Stainless Steel Column Cladding — Workshop 1:1 Trial Assembly",
    "sourceExcerpt": "A full-height workshop trial for double-curved satin stainless steel column cladding in Central Hong Kong, showing formed skins, steel ring frames, inspection lighting and narrow seams.",
    "title": "Double-Curved Stainless Steel Column Cladding",
    "description": "See the 1:1 factory trial for double-curved satin stainless steel column cladding in Central Hong Kong, from steel ring frames to hairline seams."
  },
  "case-studies/backlit-fluted-metal-boutique-facade": {
    "sourceTitle": "Backlit Fluted Metal Storefront Facade & Integrated Lighting System",
    "sourceExcerpt": "Folded silver metal, a steel subframe, prismatic facing and integrated lighting form an illuminated retail facade documented through workshop trials and installed views.",
    "title": "Backlit Fluted Metal Boutique Storefront Facade",
    "description": "Explore a backlit fluted retail facade, from steel subframes and LED lighting trials to the installed prismatic facing and illuminated window surrounds."
  },
  "case-studies/elliptical-curved-metal-entrance-pavilion": {
    "sourceTitle": "Elliptical Curved Metal Entrance Pavilion — 1:1 Factory Pre-Assembly",
    "sourceExcerpt": "A full-size workshop dry fit of a curved metal retail pavilion, documenting the oval ring beams, steel ties, paired uprights, fascia joints and curved base.",
    "title": "Elliptical Curved Metal Retail Entrance Pavilion",
    "description": "A 1:1 workshop pre-assembly of an elliptical metal retail pavilion, showing rolled oval ring beams, post connections and curved fascia alignment."
  },
  "blog/luxury-metalwork-requirements-designers-owners": {
    "sourceTitle": "What Luxury Projects Really Demand From Metalwork — Through the Eyes of the Designer and the Owner",
    "sourceExcerpt": "Luxury retail venues—boutiques, hotels, residences, museums—punish different metalwork failures. This guide pairs designer specs (signed samples, reflection integrity, 3 mm reveals, ΔE≤1.0) with owner issues (fingerprints, wobbling reflections, rattling seams, night glare, cleaning damage, ageing) and shared specs. It closes with a designer–owner–factory dialogue turning sentences into numbers, tests and evidence, plus a requirement-evidence matrix and six handover checks per venue.",
    "title": "Luxury Metalwork: Design & Owner Requirements",
    "description": "Compare designer and owner requirements for luxury metalwork, from approved samples and surface finishes to reflection quality, cleaning and handover."
  },
  "blog/metalwork-assembly-fit-out-process-and-quality-control": {
    "sourceTitle": "Luxury Retail Fit-Out Metalwork: Assembly and Installation — 12 Process Steps, 28 Control Points and 6 Joint Details",
    "sourceExcerpt": "Concise guide to architectural metalwork assembly and fit-out for luxury retail, high-end residential and hospitality: differing priorities across three settings; base-material/surface systems with PVD colour control; 12 steps from 3D laser survey to handover (6 factory, 6 site) with control points; six joints from back-bolt hanging to concealed light coves; 12-week programme and overlaps; thermal expansion; six defects causing >80% of complaints; tool lists and acceptance criteria side by side.",
    "title": "Retail Metalwork Assembly & Installation",
    "description": "Plan luxury retail metalwork assembly and installation with 12 process steps, 28 control points, six joint details and practical acceptance criteria."
  },
  "blog/metalwork-welding-process-and-quality-control": {
    "sourceTitle": "High-End Metalwork Welding: Full-Process Workmanship Standard",
    "sourceExcerpt": "A full-process welding workmanship standard for luxury retail, residence and hotel interiors: weld grade zoning, the ten-step process chain, base-metal and filler matching, TIG and laser welding parameters, groove design, distortion control, post-weld finishing, defect prevention and acceptance criteria.",
    "title": "High-End Metalwork Welding & Quality Control",
    "description": "Review high-end metalwork welding, from base-metal and filler selection to TIG and laser welding, distortion control, finishing and acceptance checks."
  },
  "blog/metalwork-cutting-fabrication-process-and-quality-control": {
    "sourceTitle": "Metalwork Cutting and Fabrication: Full Process, Details and Quality Control",
    "sourceExcerpt": "A full-process technical guide to architectural metalwork fabrication for luxury retail, premium residential and hotel projects: material grades and surface finishes, nesting and cutting, V-grooving and bending, welding and polishing, PVD coating, four typical junction details, inspection standards, defect control and key production data.",
    "title": "Metal Cutting & Fabrication Quality Control",
    "description": "Review metalwork fabrication from sheet nesting and cutting to V-grooving, bending, junction details, factory inspection and site acceptance."
  },
  "blog/metalwork-raw-material-screening-process-and-quality-control": {
    "sourceTitle": "Luxury Retail Fit-Out Metalwork: Raw Material Screening — Eight Gates, Fourteen Tests and Three Validation Rounds",
    "sourceExcerpt": "Procurement-grade raw-material screening guide for luxury metalwork: an 8-step closed loop with veto items; a 120→2 supplier funnel; a base-material grade matrix; 7 surface treatments and cost structure; on-site inspection; 14 contract tests and acceptance criteria; first-pass yield and ΔE control; tiered supplier management; an 8-week sampling timeline; 8 common failure modes; and 12 document types to archive.",
    "title": "Raw Material Screening for Luxury Metalwork",
    "description": "Screen raw materials for luxury metalwork with eight process gates, 14 tests, supplier checks, surface treatment reviews and sampling approval steps."
  },
  "blog/why-1-to-1-factory-trial-assembly-matters-curved-metalwork": {
    "sourceTitle": "What a 1:1 Factory Trial Assembly Should Prove for Curved Metalwork",
    "sourceExcerpt": "Use a full-scale workshop trial to check the hard-to-correct interfaces in curved cladding, handrails and balustrades. Define the trial extent, datums, finish review and evidence before packing.",
    "title": "1:1 Factory Trial Assembly for Curved Metalwork",
    "description": "Specify a 1:1 factory trial for curved cladding, stair handrails or balustrades. Define the extent, datums, seam and finish checks before dispatch."
  },
  "blog/how-to-prepare-rfq-package-custom-architectural-metalwork": {
    "sourceTitle": "How to Prepare an RFQ Package for Custom Architectural Metalwork",
    "sourceExcerpt": "Build a fabricator-ready RFQ with coordinated drawings, finish and sample requirements, surveyed interfaces and a delivery route. Use the bid checklist to compare scope and assumptions.",
    "title": "RFQ Checklist for Custom Architectural Metalwork",
    "description": "Prepare an architectural metalwork RFQ with coordinated drawings, finish samples, site dimensions and packing requirements. Compare bids on the same scope."
  },
  "blog/architectural-metal-finishes-brushed-mirror-hammered-pvd-guide": {
    "sourceTitle": "How to Specify Brushed, Mirror, Hammered and PVD Architectural Metal Finishes",
    "sourceExcerpt": "A buyer's guide to comparing brushed and mirror stainless steel, hammered brass and PVD colour on full-size samples, joints and curves before releasing a metalwork package.",
    "title": "Architectural Metal Finishes: Brushed, Mirror & PVD",
    "description": "Compare brushed, mirror, hammered brass and PVD metal finishes. See what to check on formed samples, corners and joints before approving fabrication."
  },
  "blog/stainless-steel-304-vs-316l-brass-bronze-commercial-projects": {
    "sourceTitle": "304 vs 316L Stainless Steel, Brass and Bronze for Commercial Metalwork",
    "sourceExcerpt": "Choose substrates for commercial metalwork by exposure and fabrication. Compare 304 with 316L stainless steel, identify brass and bronze alloys, and specify PVD separately from the base grade.",
    "title": "304 vs 316L Stainless Steel, Brass & Bronze",
    "description": "Choose 304 or 316L stainless steel, brass or bronze for commercial metalwork. Compare exposure, welds, finishes and bill-of-materials checks."
  }
};

export function getEditorialSeo(kind: EditorialKind, source: EditorialSeoInput): EditorialSeo {
  const curated = curatedEditorialSeo[`${kind}/${source.slug}`];
  if (!curated || curated.sourceTitle !== source.title) {
    return { title: source.title, description: source.excerpt };
  }

  return {
    title: curated.title,
    description: curated.sourceExcerpt === source.excerpt ? curated.description : source.excerpt,
  };
}
