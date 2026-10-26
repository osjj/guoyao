export type EditorialKind = "blog" | "case-studies";
export type EditorialSeoInput = { slug: string; title: string; excerpt: string };
export type EditorialSeo = { title: string; description: string };

type CuratedEditorialSeo = EditorialSeo & { sourceTitle: string; sourceExcerpt: string };

// Editorial summaries of the seven published stories reviewed on 26 October 2026.
// Source checks preserve later CMS edits instead of silently applying stale copy.
const curatedEditorialSeo: Record<string, CuratedEditorialSeo> = {
  "case-studies/tiffany-boutique-backlit-facade": {
    "sourceTitle": "Tiffany & Co. Boutique Backlit Facade — From Inquiry to Acceptance",
    "sourceExcerpt": "How Guoyao Metalwork delivered a backlit fluted silver facade and illuminated TIFFANY & CO. lettering for luxury boutiques in China — 18 documented stages from the first inquiry through fabrication, mock-up, export packing and site installation to final acceptance and aftercare.",
    "title": "Tiffany & Co. Backlit Metal Facade",
    "description": "Explore a Tiffany boutique backlit metal facade, from inquiry and mock-up through fabrication, export packing, installation and final acceptance."
  },
  "case-studies/murray-road-column-cladding": {
    "sourceTitle": "From Inquiry to Acceptance: The Murray Road Column Cladding Project, Hong Kong, China",
    "sourceExcerpt": "A complete case study of a sculptural column cladding project at Murray Road, Central, Hong Kong, China: sixteen stages from the first inquiry, site survey, shop drawings and sample approval through curve forming, full-scale factory trial assembly, seam treatment, export packing, site installation to client acceptance and aftercare — documented with 42 project photographs and a factory video.",
    "title": "Murray Road Sculptural Column Cladding",
    "description": "Follow the Murray Road column cladding project in Hong Kong, from site survey and curve forming to factory trial assembly, installation and acceptance."
  },
  "case-studies/lancome-boutique-entrance-pavilion": {
    "sourceTitle": "Lancôme Style Boutique Entrance Pavilion — Elliptical Metal Portal, From Inquiry to Acceptance",
    "sourceExcerpt": "How a Chinese metal factory fabricated an elliptical Lancôme style boutique entrance pavilion: BIM engineering, ring rolling, TIG welding, PVDF coating, LED fascia integration, factory pre-assembly with 21 real workshop photos, export packing and mall installation.",
    "title": "Lancôme Style Elliptical Entrance Pavilion",
    "description": "Explore an elliptical Lancôme style boutique entrance pavilion, covering BIM engineering, metal forming, welding, coating and factory pre-assembly."
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
  "blog/metalwork-raw-material-screening-process-and-quality-control": {
    "sourceTitle": "Luxury Retail Fit-Out Metalwork: Raw Material Screening — Eight Gates, Fourteen Tests and Three Validation Rounds",
    "sourceExcerpt": "Procurement-grade raw-material screening guide for luxury metalwork: an 8-step closed loop with veto items; a 120→2 supplier funnel; a base-material grade matrix; 7 surface treatments and cost structure; on-site inspection; 14 contract tests and acceptance criteria; first-pass yield and ΔE control; tiered supplier management; an 8-week sampling timeline; 8 common failure modes; and 12 document types to archive.",
    "title": "Raw Material Screening for Luxury Metalwork",
    "description": "Screen raw materials for luxury metalwork with eight process gates, 14 tests, supplier checks, surface treatment reviews and sampling approval steps."
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
