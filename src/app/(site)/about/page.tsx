import type { Metadata } from "next";
import Image from "next/image";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { InquiryButton } from "@/components/site/inquiry-contact";
import { MetalMotion } from "@/components/site/metal-motion";
import { ProjectRecordsCarousel } from "@/components/site/project-records-carousel";
import { projectRecords } from "@/data/project-experience";
import { COMPANY_NAME } from "@/lib/site-identity";
import home from "../home.module.css";
import styles from "./about.module.css";

const atelierDisplay = Manrope({ subsets: ["latin"], variable: "--font-atelier-display", display: "swap" });
const atelierSerif = Cormorant_Garamond({ subsets: ["latin"], weight: "500", style: "italic", variable: "--font-atelier-serif", display: "swap" });

const media = "https://media.guoyaometal.com/about/";

const heroStats = [
  { value: "2003", label: "Founded in Foshan, Guangdong" },
  { value: "4,500 m²", label: "Cutting, forming, welding, coating, packing" },
  { value: "80+", label: "Craftsmen, engineers and designers" },
  { value: "ISO 9001", label: "Certified quality system since 2014" },
  { value: "10+", label: "Countries served, 2016–2026" },
];

const categories = [
  { number: "01", title: "Storefronts & entrances", image: `${media}boutique-night.webp`, alt: "Curved dark bronze cladding and illuminated portal on a luxury boutique at night", stage: "Installed view", text: "Metal facades, entrance frames and portals — the details that give a retail space its identity, and a street its rhythm.", inquiry: "storefront and entrance metalwork" },
  { number: "02", title: "Curved cladding", image: `${media}residence-seam.webp`, alt: "Tight seam between double-curved column cladding panels", stage: "Workshop detail", text: "Shaped panels, column covers and sculptural surfaces — double-curved forms resolved in the model before they exist in metal.", inquiry: "curved architectural cladding" },
  { number: "03", title: "Stairs & rails", image: `${media}stairs-rails.webp`, alt: "Curved balustrade sections and handrail profiles on trestles during workshop pre-assembly", stage: "Workshop pre-assembly", text: "Balustrades, handrail profiles and the transitions between levels — pre-assembled so the line reads uninterrupted on site.", inquiry: "stair balustrades and handrails" },
  { number: "04", title: "Display fixtures", image: `${media}hotel-vitrine.webp`, alt: "Hammered brass vitrine with warm internal glow", stage: "Workshop view", text: "Counters, glass display cabinets and freestanding pieces — hammered, brushed and patinated surfaces built for considered presentation.", inquiry: "metal display cabinets and fixtures" },
];

const stories = [
  { title: "Reflective boutique facades", stage: "Installed view · Tiffany & Co.", image: `${media}tiffany-night.webp`, alt: "Backlit boutique facade glowing on a luxury retail street at night", text: "Forty-plus stores, one signed finish master, ΔE held within 1.0 across three continents.", href: "/case-studies/tiffany-boutique-backlit-facade" },
  { title: "Sculptural column cladding", stage: "Pre-assembly · Murray Road, Hong Kong", image: `${media}residence-accept.webp`, alt: "Client representative inspecting double-curved column cladding in a residence lobby", text: "Double-curved petal columns accepted first-pass on site.", href: "/case-studies/murray-road-column-cladding" },
  { title: "A curved entrance framework", stage: "Pre-assembly · Entrance pavilion", image: `${media}pavilion-preassembly.webp`, alt: "Elliptical entrance pavilion fully pre-assembled on scaffolding in the workshop", text: "Fully pre-assembled at 1:1 — because if it fits here, it fits on site.", href: "/case-studies/lancome-boutique-entrance-pavilion" },
];

const designers = [
  {
    name: "Mr. Wang Haifeng",
    role: "Design Director · 22 years",
    image: `${media}designer-wang.webp`,
    alt: "Mr. Wang, design director, comparing two brushed stainless steel sample coupons",
    bio: "Led the metalwork design for more than 200 boutique projects, including multi-city rollouts where the same facade must land identically in Changsha, Seoul and Las Vegas. His rule across the workshop: the sample is the contract.",
    tags: ["Brand facade language", "Rollout standardisation", "Mock-up governance"],
  },
  {
    name: "Ms. Lin Wenjing",
    role: "Senior Designer · Surface & Finishes · 12 years",
    image: `${media}designer-2.webp`,
    alt: "Ms. Lin, senior designer for surface and finishes, holding brass coupons in the sample library",
    bio: "Owns what a surface promises and what it delivers. She writes the finish standards and holds every batch to ΔE ≤ 1.0 against the approved master. Her library of 400+ metal coupons is the first stop of every new brief.",
    tags: ["Finish standards", "Colour & ΔE control", "PVD / PVDF / anodising"],
  },
  {
    name: "Mr. Zhou Ke",
    role: "Parametric Engineer · Geometry & Nodes · 9 years",
    image: `${media}designer-3.webp`,
    alt: "Mr. Zhou, parametric engineer, at dual monitors with a double-curved facade model",
    bio: "Builds the parametric models behind the workshop's hardest geometry — column claddings, portal rings, perforated dome shells — turning sculptural intent into node drawings a machine can execute, verified by laser tracker to ±0.8 mm.",
    tags: ["Double-curved geometry", "Node engineering", "Laser tracking ±0.8 mm"],
  },
];

const workshopStages = [
  { number: "01", title: "Deepen & engineer", detail: "BIM models / node drawings / part codes", image: `${media}piaget-workshop.webp`, alt: "Curved portal framework under assembly in the workshop" },
  { number: "02", title: "Cut & form", detail: "6 kW fiber lasers / CNC roll-benders / press brakes", image: `${media}fac-laser.webp`, alt: "Fiber laser cutting a perforated aluminium panel" },
  { number: "03", title: "Weld & assemble", detail: "Fixture-built assemblies / certified TIG / invisible seams", image: `${media}fac-welding.webp`, alt: "Certified TIG welder on a fixture-built frame" },
  { number: "04", title: "Coat & finish", detail: "In-house PVDF / PVD partner lines / batch records", image: `${media}fac-coating.webp`, alt: "Robotic PVDF coating line" },
  { number: "05", title: "Prove at 1:1", detail: "Raking-light inspection / signed visual masters", image: `${media}fac-mockup.webp`, alt: "1:1 mock-up inspected under raking light" },
  { number: "06", title: "Pack & ship", detail: "VCI film / coded crates / photo-documented loading", image: `${media}export-yard.webp`, alt: "Containers loaded with coded export crates at dusk" },
  { number: "07", title: "Test & certify", detail: "Salt-spray chambers / gloss meters / per-batch reports", image: `${media}fac-lab.webp`, alt: "Materials testing laboratory with salt spray chamber and instruments" },
];

const reasons = [
  { title: "A decade of re-awards", text: "Forty-plus Tiffany stores across ten years. LV, Cartier and Dior programs returning city after city. Brands do not re-award factories that surprise them." },
  { title: "The sample is the contract", text: "Nothing enters production until a 1:1 mock-up is approved under raking light and signed. Every later batch answers to that signature." },
  { title: "One roof, no handoffs", text: "Deepening, cutting, forming, welding, coating, QC laboratory, mock-up hall and export packing — all in-house. Tolerances survive because they never change hands." },
  { title: "One-vote-veto quality culture", text: "Wrong alloy, short certificate, ΔE over limit, unapproved weld repair — any one rejects the lot, regardless of schedule. ISO 9001 since 2014." },
  { title: "Night, mall and airport fluency", text: "Operating malls, restricted airport zones, Macau cargo-zone offloading. Two-night installations rehearsed, not improvised." },
  { title: "Cross-border delivery machinery", text: "Coded crates, VCI protection, photo-documented loading, and a logistics team that has cleared customs on four continents." },
  { title: "Confidentiality by default", text: "Unbranded mock-ups, staged photography, NDA-first site coordination. New flagship designs are seen only by the people who need to see them." },
  { title: "Scale with a named person on the phone", text: "4,500 m² and 80+ specialists is large enough to hold a rollout program — small enough that the design director answers the call himself." },
];

const proofPoints = [
  { ask: "Every city must look identical.", answer: "Master samples, ΔE ≤ 1.0 batch control, finish passports per shipment." },
  { ask: "The facade is the brand.", answer: "Design-director-led facade language; mock-up governance on every project." },
  { ask: "We cannot close the mall.", answer: "Night hoists, tagged lines, two-night install plans rehearsed at 1:1." },
  { ask: "We want sculpture, not cladding.", answer: "Parametric engineering with laser-tracker verification to ±0.8 mm / 2 m." },
  { ask: "No surprises on site.", answer: "Survey before fabrication — site conflicts resolved before cutting. Measured, not promised." },
];

export const metadata: Metadata = {
  title: "About — GUOYAO METAL | Architectural Metalwork",
  description:
    "Meet GUOYAO METAL (广州市国耀高薪材料科技有限公司): a Foshan workshop of 4,500 m² and 80+ specialists fabricating storefronts, curved cladding, stairs and display fixtures for luxury retail, hotels, residences and museums — a decade of brand programs across 10+ countries.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <MetalMotion className={`${home.page} ${atelierDisplay.variable} ${atelierSerif.variable} ${styles.about}`}>
      {/* HERO — dark atelier style */}
      <section className={home.hero} aria-labelledby="about-title">
        <div className={home.container}>
          <div className={home.heroIntro}>
            <div>
              <p className={home.kicker}>GUOYAO METAL / COMPANY PROFILE · EST. 2003</p>
              <h1 id="about-title">The workshop behind<br /><em>the work.</em></h1>
            </div>
            <div className={home.heroBrief}>
              <p>
                For the spaces we enter, move through and remember. GUOYAO METAL designs and
                fabricates architectural metalwork — storefronts, curved cladding, stairs and
                display fixtures — for luxury retail, hotels, residences and museums. One workshop,
                one team, from the first sample to the last crate.
              </p>
              <div className={home.heroActions}>
                <a href="#workshop" className={home.darkButton}>Inside the workshop <ArrowDown size={16} aria-hidden="true" /></a>
                <InquiryButton className={home.textLink}>Discuss a project <ArrowUpRight size={16} aria-hidden="true" /></InquiryButton>
              </div>
            </div>
          </div>
          <div className={home.heroMosaic}>
            <figure className={home.heroMain}>
              <div className={home.heroPhoto}>
                <Image src={`${media}hero-factory.webp`} alt="Guoyao main assembly hall — curved boutique facade units on jigs, CNC lines, workers in navy uniforms" fill priority sizes="(max-width: 850px) calc(100vw - 40px), 66vw" />
              </div>
              <figcaption><div><span>FOSHAN WORKSHOPS / MAIN ASSEMBLY HALL</span><p>Boutique facade units on fabrication jigs, CNC lines along the wall.</p></div></figcaption>
            </figure>
            <div className={home.heroSide}>
              <figure>
                <div className={home.heroPhoto}><Image src={`${media}jewelry-gold.webp`} alt="Champagne-gold metalwork and glowing vitrines of a luxury jewellery boutique at dusk" fill sizes="(max-width: 700px) 66vw, 45vw" /></div>
                <figcaption><div><span>RETAIL / INSTALLED VIEW</span><p>Jewellery-grade surfaces, at dusk.</p></div></figcaption>
              </figure>
              <figure>
                <div className={home.heroPhoto}><Image src={`${media}museum-dome.webp`} alt="Perforated steel and aluminium dome casting a rain of light inside a museum atrium" fill sizes="(max-width: 700px) 66vw, 45vw" /></div>
                <figcaption><div><span>MUSEUM / INSTALLED VIEW</span><p>A rain of light, layer by layer.</p></div></figcaption>
              </figure>
            </div>
          </div>
          <dl className={styles.statGrid} aria-label="Company facts">
            {heroStats.map((stat) => (
              <div className={styles.statItem} key={stat.value}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
          <div className={home.heroFoot}>
            <span>STOREFRONTS &amp; ENTRANCES</span><span>ARCHITECTURAL CLADDING</span><span>STAIRS &amp; BALUSTRADES</span><span>DISPLAYS &amp; FIXTURES</span>
          </div>
        </div>
      </section>

      {/* 01 WHAT WE MAKE — green-grey applications style */}
      <section className={home.applications} id="what-we-make" aria-labelledby="make-title">
        <div className={home.container}>
          <div className={home.sectionHead} data-index="01" data-metal-reveal>
            <div>
              <p className={home.kicker}>01 / WHAT WE MAKE</p>
              <h2 id="make-title">Different settings.<br /><em>A shared material language.</em></h2>
            </div>
            <p className={home.sectionDescription}>From a building&apos;s first impression to the smallest feature within it. Four applications, one standard of form, surface and connection.</p>
          </div>
          <div className={home.applicationGrid}>
            {categories.map((category) => (
              <article className={home.applicationCard} key={category.number} data-metal-reveal>
                <div className={home.applicationImage}><Image src={category.image} alt={category.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 90vw, 48vw" /></div>
                <div className={home.applicationMeta}><span>{category.number}</span><span>{category.stage}</span></div>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
                <InquiryButton className={home.applicationLink} product={{ name: category.inquiry }}>Discuss this application <ArrowUpRight size={15} aria-hidden="true" /></InquiryButton>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 02 PROJECT EXPERIENCE — shared carousel */}
      <section className={`${home.stories} ${styles.plain}`} id="project-experience" aria-labelledby="experience-title">
        <div className={home.container}>
          <div className={home.sectionHead} data-index="02" data-metal-reveal>
            <div>
              <p className={home.kicker}>02 / PROJECT EXPERIENCE 2016–2026</p>
              <h2 id="experience-title">Familiar names.<br /><em>Considered details.</em></h2>
            </div>
            <p className={home.sectionDescription}>A selection from the project register. The strongest endorsement in this tier is re-award: the same houses, city after city, return to the same workshop — 120+ named projects in a decade.</p>
          </div>
        </div>
        <ProjectRecordsCarousel items={projectRecords} />
      </section>

      {/* 03 PROJECT STORIES — light stories style */}
      <section className={`${home.stories} ${styles.plain}`} id="selected-stories" aria-labelledby="stories-title">
        <div className={home.container}>
          <div className={home.sectionHead} data-index="03" data-metal-reveal>
            <div>
              <p className={home.kicker}>03 / SELECTED PROJECT STORIES</p>
              <h2 id="stories-title">A closer look at <em>the work.</em></h2>
            </div>
            <a href="/case-studies" className={home.textLink}>All project stories <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <div className={home.storyGrid}>
            {stories.map((story, index) => (
              <article className={home.storyCard} key={story.href} data-metal-reveal>
                <a href={story.href} className={home.storyImageLink} aria-label={`View ${story.title}`}>
                  <div className={home.storyImage}><Image src={story.image} alt={story.alt} fill sizes="(max-width: 700px) calc(100vw - 40px), 40vw" /></div>
                </a>
                <div className={home.storyMeta}><span>{story.stage}</span><span>0{index + 1}</span></div>
                <a href={story.href} className={home.storyTitle}><h3>{story.title}</h3><ArrowUpRight size={19} aria-hidden="true" /></a>
                <p>{story.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04 DESIGN TEAM — light, editorial cards */}
      <section className={`${home.stories} ${styles.plain}`} id="design-team" aria-labelledby="team-title">
        <div className={home.container}>
          <div className={home.sectionHead} data-index="04" data-metal-reveal>
            <div>
              <p className={home.kicker}>04 / THE DESIGN TEAM</p>
              <h2 id="team-title">Where material meets<br /><em>architectural intent.</em></h2>
            </div>
            <p className={home.sectionDescription}>Three senior designers lead the translation from intent to numbers, tolerances and signed samples.</p>
          </div>
          <div className={styles.designerGrid}>
            {designers.map((designer) => (
              <article className={styles.designerCard} key={designer.name} data-metal-reveal>
                <div className={styles.designerImage}><Image src={designer.image} alt={designer.alt} fill sizes="(max-width: 850px) 100vw, 33vw" /></div>
                <div className={styles.designerMeta}><span>{designer.role}</span></div>
                <h3>{designer.name}</h3>
                <p>{designer.bio}</p>
                <ul aria-label={`${designer.name} focus areas`}>
                  {designer.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <figure className={styles.teamFigure} data-metal-reveal>
            <div className={home.storyImage}><Image src={`${media}designer-1.webp`} alt="The design office — boutique facade drawings pinned for daily review" fill sizes="(max-width: 850px) 100vw, 1200px" /></div>
            <figcaption><span>DAILY DESIGN REVIEW</span><p>Every drawing is argued over at the wall before it reaches the shop floor.</p></figcaption>
          </figure>
        </div>
      </section>

      {/* 05 INSIDE THE WORKSHOP — dark atelier style */}
      <section className={home.workshop} id="workshop" aria-labelledby="workshop-title">
        <div className={home.container}>
          <div className={home.sectionHead} data-index="05" data-metal-reveal>
            <div>
              <p className={home.kickerLight}>05 / INSIDE THE WORKSHOP</p>
              <h2 id="workshop-title">The making <em>is part of the story.</em></h2>
            </div>
            <p className={home.workshopIntro}>A luxury storefront is only as good as its weakest handoff. The answer is to remove handoffs: one workshop, one data set, seven controlled stages.</p>
          </div>
          <div className={home.workshopGrid}>
            {workshopStages.map((stage) => (
              <figure key={stage.number} data-metal-reveal>
                <div className={home.workshopImage}><Image src={stage.image} alt={stage.alt} fill sizes="(max-width: 700px) 100vw, 35vw" /></div>
                <figcaption>
                  <h3>{stage.number} / {stage.title}</h3>
                  <p>{stage.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className={home.workshopBottom}>
            <p>Form. Surface. Connection.</p>
            <InquiryButton className={home.lightLink}>Discuss a project <ArrowUpRight size={17} aria-hidden="true" /></InquiryButton>
          </div>
        </div>
      </section>

      {/* 06 WHY CLIENTS RETURN — light two-column */}
      <section className={`${home.stories} ${styles.plain}`} id="why-guoyao" aria-labelledby="why-title">
        <div className={home.container}>
          <div className={home.sectionHead} data-index="06" data-metal-reveal>
            <div>
              <p className={home.kicker}>06 / WHY THE SAME NAMES RETURN</p>
              <h2 id="why-title">Eight reasons,<br /><em>none of them slogans.</em></h2>
            </div>
          </div>
          <div className={styles.whyGrid}>
            {reasons.map((reason, index) => (
              <article className={styles.whyItem} key={reason.title} data-metal-reveal>
                <span className={styles.whyNumber}>0{index + 1}</span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.proofPanel} data-metal-reveal>
            <p className={styles.proofKicker}>What the client asks / how Guoyao answers</p>
            <div className={styles.proofList}>
              {proofPoints.map((point) => (
                <div key={point.ask}>
                  <span>&ldquo;{point.ask}&rdquo;</span>
                  <p>{point.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 07 START A CONVERSATION — golden brief style */}
      <section className={home.projectBrief} id="start-conversation" aria-labelledby="brief-title">
        <div className={`${home.container} ${home.briefGrid}`}>
          <div>
            <p className={home.kicker}>07 / START A CONVERSATION</p>
            <h2 id="brief-title">Tell us what<br /><em>you have in mind.</em></h2>
            <p className={home.briefDescription}>A drawing, a reference image or an initial idea — a material strategy within one week, samples within eight.</p>
            <InquiryButton className={home.darkButton}>Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></InquiryButton>
            <p className={styles.companyLine}><span lang="zh-CN">{COMPANY_NAME}</span><span>Workshops in Foshan, Guangdong · ISO 9001 since 2014</span></p>
          </div>
          <div className={home.briefList}>
            <p>A few useful starting points</p>
            <div><span>01</span><p>Project location &amp; application — the materials it will sit beside</p></div>
            <div><span>02</span><p>Drawings &amp; approximate dimensions — sketches, references or early CAD</p></div>
            <div><span>03</span><p>Quantities &amp; finish references — or the effect you want, if the finish name is still open</p></div>
          </div>
        </div>
      </section>
    </MetalMotion>
  );
}
