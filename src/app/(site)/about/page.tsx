import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { InquiryButton } from "@/components/site/inquiry-contact";
import { COMPANY_NAME } from "@/lib/site-identity";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Metalwork. With presence.",
  description:
    "GUOYAO METAL (广州市国耀高薪材料科技有限公司): architectural metalwork with presence — storefronts, curved cladding, stairs and display fixtures for luxury retail, hotels, residences and museums. A decade of brand programs across 10+ countries, ISO 9001 certified.",
  alternates: { canonical: "/about" },
};

const heroStats = [
  { value: "2003", label: "Founded in Foshan, Guangdong — two decades of metal craft" },
  { value: "4,500 m²", label: "Workshops for cutting, forming, welding, coating and packing" },
  { value: "80+", label: "Craftsmen, engineers and designers on one floor" },
  { value: "ISO 9001", label: "Certified quality management since 2014" },
  { value: "10+", label: "Countries and regions — brand programs from 2016 to 2026" },
];

const categories = [
  {
    index: "01 · Storefronts & entrances",
    title: "Storefronts & entrances",
    description:
      "Metal facades, entrance frames and portals — the details that give a retail space its identity, and a street its rhythm.",
    image: "https://media.guoyaometal.com/about/boutique-night.webp",
    alt: "Curved dark bronze cladding and illuminated portal on a luxury boutique at night",
  },
  {
    index: "02 · Architectural cladding",
    title: "Curved cladding",
    description:
      "Shaped panels, column covers and sculptural surfaces — double-curved forms resolved in the model before they exist in metal.",
    image: "https://media.guoyaometal.com/about/residence-seam.webp",
    alt: "Tight seam between double-curved column cladding panels",
  },
  {
    index: "03 · Stairs & balustrades",
    title: "Stairs & rails",
    description:
      "Balustrades, handrail profiles and the transitions between levels — pre-assembled in the workshop so the line reads uninterrupted on site.",
    image: "https://media.guoyaometal.com/about/stairs-rails.webp",
    alt: "Curved balustrade sections and handrail profiles on trestles during workshop pre-assembly",
  },
  {
    index: "04 · Displays & fixtures",
    title: "Display fixtures",
    description:
      "Counters, glass display cabinets and freestanding pieces — hammered, brushed and patinated surfaces built for considered presentation.",
    image: "https://media.guoyaometal.com/about/hotel-vitrine.webp",
    alt: "Hammered brass vitrine with warm internal glow",
  },
];

const heroBrands = ["Tiffany & Co.", "Louis Vuitton", "Cartier", "Dior"];
const otherBrands = [
  "Ferragamo",
  "Hermès",
  "Prada",
  "Valentino",
  "Moncler",
  "Fendi",
  "Victoria's Secret",
  "Four Seasons",
];

const projectArchive = [
  { project: "Shanghai IFC", place: "Shanghai · 2025–2026", scope: "Boutique metalwork program" },
  { project: "SKP", place: "Beijing · 2025–2026", scope: "Flagship storefront & fixtures" },
  { project: "Alexandra House", place: "Hong Kong · 2025–2026", scope: "Store hoarding" },
  { project: "Las Vegas", place: "United States · 2024", scope: "Boutique facade program" },
  { project: "Taikoo Li Qiantan", place: "Shanghai · 2023", scope: "Storefront metalwork" },
  { project: "Daxing Airport", place: "Beijing · 2023", scope: "Airport retail metalwork, restricted-zone install" },
  { project: "Four Seasons", place: "Macau · 2023", scope: "Precinct metalwork, cargo-zone logistics" },
  { project: "Hangzhou Tower", place: "Hangzhou · 2022", scope: "Boutique storefront" },
  { project: "The MixC", place: "Shenzhen · 2021–2022", scope: "Facade programs, two brands, two years" },
  { project: "IFS", place: "Chengdu · 2020", scope: "Flagship storefront & facade" },
  { project: "The Chanakya", place: "Delhi · 2019", scope: "Overseas boutique program" },
  { project: "Sydney", place: "Australia · 2018", scope: "Overseas boutique program" },
  { project: "Harbour City", place: "Hong Kong · 2017", scope: "Waterfront retail facade" },
  { project: "Harbour City · Gateway Arcade", place: "Hong Kong · 2016", scope: "Boutique fit-out metalwork" },
  { project: "Lee Gardens", place: "Hong Kong · 2016", scope: "Flagship storefront" },
  { project: "Yunda Central Plaza", place: "Changsha · 2016", scope: "The first of forty — start of a decade-long rollout" },
];

const stories = [
  {
    caption: "Installed view · Tiffany & Co.",
    title: "Reflective boutique facades",
    description:
      "Repeated surfaces, changing reflections and the character of a storefront — forty-plus stores, one signed finish master, ΔE held within 1.0 across three continents.",
    image: "https://media.guoyaometal.com/about/tiffany-night.webp",
    alt: "Backlit boutique facade glowing on a luxury retail street at night",
  },
  {
    caption: "Workshop pre-assembly · Murray Road, Hong Kong",
    title: "Sculptural column cladding",
    description:
      "The scale of a curved form, seen together with its panel divisions and junctions — double-curved petal columns accepted first-pass on site.",
    image: "https://media.guoyaometal.com/about/residence-accept.webp",
    alt: "Client representative inspecting double-curved column cladding in a residence lobby",
  },
  {
    caption: "Workshop pre-assembly · Entrance pavilion",
    title: "A curved entrance framework",
    description:
      "An entrance structure with its curved profile and framework still in view — fully pre-assembled at 1:1, because if it fits here, it fits on site.",
    image: "https://media.guoyaometal.com/about/pavilion-preassembly.webp",
    alt: "Elliptical entrance pavilion fully pre-assembled on scaffolding in the workshop",
  },
];

const designers = [
  {
    name: "Mr. Wang Haifeng",
    role: "Design Director · 22 years in architectural metalwork",
    bio: "Wang has led the metalwork design for more than 200 boutique projects — including multi-city rollout programs where the same facade must land identically in Changsha, Seoul and Las Vegas. His rule is known across the workshop: the sample is the contract. If the 1:1 mock-up under raking light does not satisfy him, production does not start.",
    tags: ["Brand facade language", "Rollout standardisation", "Mock-up governance"],
    image: "https://media.guoyaometal.com/about/designer-wang.webp",
    alt: "Mr. Wang, design director, comparing two brushed stainless steel sample coupons",
  },
  {
    name: "Ms. Lin Wenjing",
    role: "Senior Designer · Surface & Finishes · 12 years",
    bio: "Lin owns the most unforgiving territory in the workshop: what a surface promises and what it delivers. Brushed grain direction, mirror clarity, PVD tints, patinated brass, PVDF colour systems — she writes the finish standards and holds every batch to ΔE ≤ 1.0 against the approved master. Her library of 400+ metal coupons is the first stop of every new brief.",
    tags: ["Finish standards", "Colour & ΔE control", "PVD / PVDF / anodising"],
    image: "https://media.guoyaometal.com/about/designer-2.webp",
    alt: "Ms. Lin, senior designer for surface and finishes, holding brass coupons in the sample library",
  },
  {
    name: "Mr. Zhou Ke",
    role: "Parametric Engineer · Geometry & Nodes · 9 years",
    bio: "Where a facade curves in two directions, intuition fails and mathematics takes over. Zhou builds the parametric models behind the workshop's hardest geometry — column claddings, portal rings, perforated dome shells — and turns sculptural intent into node drawings a machine can execute, verified by laser tracker to ±0.8 mm over two metres.",
    tags: ["Double-curved geometry", "Node engineering", "Laser tracking ±0.8 mm"],
    image: "https://media.guoyaometal.com/about/designer-3.webp",
    alt: "Mr. Zhou, parametric engineer, at dual monitors with a double-curved facade model",
  },
];

const workshopStages = [
  {
    number: "01",
    title: "Deepen & engineer",
    description:
      "Design intent becomes a BIM model, node drawings and part codes. Every curved surface is resolved before a single sheet is cut.",
    image: "https://media.guoyaometal.com/about/piaget-workshop.webp",
    alt: "Curved portal framework under assembly in the workshop",
  },
  {
    number: "02",
    title: "Cut & form",
    description:
      "6 kW fiber lasers, CNC roll-benders and press brakes shape stainless, aluminium and brass to the model — not to habit.",
    image: "https://media.guoyaometal.com/about/fac-laser.webp",
    alt: "Fiber laser cutting a perforated aluminium panel",
  },
  {
    number: "03",
    title: "Weld & assemble",
    description:
      "Fixture-built assemblies, certified TIG welds, dressed and polished to invisible seams. Spatter and heat tint are rejects, not touch-ups.",
    image: "https://media.guoyaometal.com/about/fac-welding.webp",
    alt: "Certified TIG welder on a fixture-built frame",
  },
  {
    number: "04",
    title: "Coat & finish",
    description:
      "In-house PVDF and PVD partner lines. Coating thickness, gloss and ΔE are recorded batch by batch — the finish carries a passport.",
    image: "https://media.guoyaometal.com/about/fac-coating.webp",
    alt: "Robotic PVDF coating line",
  },
  {
    number: "05",
    title: "Prove at 1:1",
    description:
      "Full-size mock-ups inspected under raking light. The signed mock-up becomes the visual master every batch is measured against.",
    image: "https://media.guoyaometal.com/about/fac-mockup.webp",
    alt: "1:1 mock-up inspected under raking light",
  },
  {
    number: "06",
    title: "Pack & ship",
    description:
      "VCI film, foam corners, coded fumigation-free crates, photo-documented loading — then the logistics chain takes over, to 10+ countries.",
    image: "https://media.guoyaometal.com/about/export-yard.webp",
    alt: "Containers loaded with coded export crates at dusk",
  },
];

const reasons = [
  {
    title: "A decade of re-awards",
    description:
      "Forty-plus Tiffany stores across ten years. LV, Cartier and Dior programs returning city after city. Brands do not re-award factories that surprise them.",
  },
  {
    title: "The sample is the contract",
    description:
      "Nothing enters production until a 1:1 mock-up is approved under raking light and signed. Every later batch answers to that signature.",
  },
  {
    title: "One roof, no handoffs",
    description:
      "Deepening, cutting, forming, welding, coating, QC laboratory, mock-up hall and export packing — all in-house. Tolerances survive because they never change hands.",
  },
  {
    title: "One-vote-veto quality culture",
    description:
      "Wrong alloy, short certificate, ΔE over limit, unapproved weld repair, missing protective film — any one rejects the lot, regardless of schedule. ISO 9001 since 2014.",
  },
  {
    title: "Night, mall and airport fluency",
    description:
      "Operating malls, restricted airport zones, Macau cargo-zone offloading. Two-night installations with zero disruption to trading neighbours are rehearsed, not improvised.",
  },
  {
    title: "Cross-border delivery machinery",
    description:
      "Coded crates, VCI protection, photo-documented loading, and a logistics team that has cleared customs on four continents.",
  },
  {
    title: "Confidentiality by default",
    description:
      "Unbranded mock-ups, staged photography, NDA-first site coordination. New flagship designs are seen only by the people who need to see them.",
  },
  {
    title: "Scale with a named person on the phone",
    description:
      "4,500 m² and 80+ specialists is large enough to hold a rollout program — small enough that the design director answers the call himself.",
  },
];

const proofTable = [
  {
    ask: "Every city must look identical.",
    answer: "Master samples, ΔE ≤ 1.0 batch control, finish passports per shipment",
    proof: "Tiffany & Co., 40+ stores, three continents",
  },
  {
    ask: "The facade is the brand.",
    answer: "Design-director-led facade language; mock-up governance on every project",
    proof: "LV / Dior / Ferragamo / Cartier / Prada programs, 2016–2026",
  },
  {
    ask: "We cannot close the mall.",
    answer: "Night hoists, tagged lines, two-night install plans rehearsed at 1:1",
    proof: "The MixC Shenzhen, IFS Chengdu, Daxing Airport, Four Seasons Macau",
  },
  {
    ask: "We want sculpture, not cladding.",
    answer: "Parametric engineering with laser-tracker verification to ±0.8 mm / 2 m",
    proof: "Perforated dome program; Murray Road columns; OCT egg-shell skin",
  },
  {
    ask: "No surprises on site.",
    answer: "Survey before fabrication — site conflicts resolved before cutting",
    proof: "Every project since 2016. Measured, not promised.",
  },
];

const startItems = [
  {
    number: "01",
    title: "Project location & application",
    description:
      "Where the element belongs — interior or exterior, retail or hospitality — and the materials it will sit beside.",
  },
  {
    number: "02",
    title: "Drawings & approximate dimensions",
    description:
      "Sketches, references or early CAD. A short note on what matters in each reference is more useful than a folder of unexplained images.",
  },
  {
    number: "03",
    title: "Quantities & finish references",
    description:
      "Element types, indicative quantities and the finishes you have in mind — or the effect you want, if the finish name is still open.",
  },
];

const miniGallery = [
  {
    caption: "Where facades are born",
    image: "https://media.guoyaometal.com/about/tiffany-workshop.webp",
    alt: "Welding a boutique facade frame",
  },
  {
    caption: "Hotel-grade brass, in-house",
    image: "https://media.guoyaometal.com/about/hotel-counter.webp",
    alt: "Hammered brass bar counter with marble top",
  },
  {
    caption: "Jewellery-grade detailing",
    image: "https://media.guoyaometal.com/about/piaget-lettering.webp",
    alt: "Precision metal lettering on a maison portal",
  },
  {
    caption: "Zero-defect acceptance",
    image: "https://media.guoyaometal.com/about/museum-accept.webp",
    alt: "Client and engineer checking the light under the finished dome",
  },
  {
    caption: "The signed finish master",
    image: "https://media.guoyaometal.com/about/hotel-sample.webp",
    alt: "Signed brass finish master sample in the factory",
  },
  {
    caption: "Coded crates, photo-documented loading",
    image: "https://media.guoyaometal.com/about/fac-container.webp",
    alt: "Coded export crates loaded into a container",
  },
  {
    caption: "Light, geometry and brand in one frame",
    image: "https://media.guoyaometal.com/about/pavilion-fascia.webp",
    alt: "Backlit ring fascia band of an entrance pavilion",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.about}>
      {/* HERO */}
      <section className={styles.hero} aria-labelledby="about-heading">
        <div className={styles.container}>
          <p className={styles.kicker}>Guoyao Metal · Foshan workshops · Est. 2003</p>
          <h1 id="about-heading">
            Metalwork. <em>With presence.</em>
          </h1>
          <p className={styles.lede}>
            For the spaces we enter, move through and remember. GUOYAO METAL designs and fabricates
            architectural metalwork — storefronts, curved cladding, stairs and display fixtures — for
            luxury retail, hotels, residences and museums. One workshop, one team, from the first
            sample to the last crate.
          </p>
        </div>
        <div className={styles.statStrip}>
          <div className={styles.container}>
            <dl className={styles.statGrid}>
              {heroStats.map((stat) => (
                <div className={styles.stat} key={stat.value}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <figure className={`${styles.container} ${styles.heroFigure}`}>
          <div className={styles.heroImage}>
            <Image
              src="https://media.guoyaometal.com/about/hero-factory.webp"
              alt="Guoyao main assembly hall — curved boutique facade units on jigs, CNC lines, workers in navy uniforms"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1440px"
            />
          </div>
          <figcaption>
            <span>The main assembly hall in Foshan</span>
            <span>Boutique facade units on fabrication jigs, CNC lines along the wall</span>
          </figcaption>
        </figure>
      </section>

      {/* 01 WHAT WE MAKE */}
      <section className={styles.section} id="what-we-make" aria-labelledby="make-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.kicker}>01 / What we make</span>
              <span className={styles.shortRule} aria-hidden="true" />
            </div>
            <div>
              <h2 id="make-heading">
                Different settings. <em>A shared material language.</em>
              </h2>
              <p className={styles.sectionSub}>
                From a building&apos;s first impression to the smallest feature within it. Four
                applications, one standard of form, surface and connection.
              </p>
            </div>
          </div>
          <div className={styles.catGrid}>
            {categories.map((cat) => (
              <article className={styles.cat} key={cat.title}>
                <div className={styles.catImage}>
                  <Image src={cat.image} alt={cat.alt} fill sizes="(max-width: 760px) 100vw, 46vw" />
                </div>
                <p className={styles.catIndex}>{cat.index}</p>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 02 FAMILIAR NAMES */}
      <section className={styles.section} id="familiar-names" aria-labelledby="brands-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.kicker}>02 / Selected brand project experience</span>
              <span className={styles.shortRule} aria-hidden="true" />
            </div>
            <div>
              <h2 id="brands-heading">
                Familiar names. <em>Considered details.</em>
              </h2>
              <p className={styles.sectionSub}>
                A selection of brands represented in our project portfolio, from 2016 to 2026. The
                strongest endorsement in this tier is re-award: the same houses, city after city,
                return to the same workshop.
              </p>
            </div>
          </div>
          <ul className={styles.brandCloud} aria-label="Brands represented in the project portfolio">
            {heroBrands.map((brand) => (
              <li className={styles.brandHero} key={brand}>
                {brand}
              </li>
            ))}
            {otherBrands.map((brand) => (
              <li key={brand}>{brand}</li>
            ))}
          </ul>
          <figure className={styles.sectionFigure}>
            <div className={styles.wideImage}>
              <Image
                src="https://media.guoyaometal.com/about/jewelry-gold.webp"
                alt="Champagne-gold metalwork and glowing vitrines of a luxury jewellery boutique at dusk"
                fill
                sizes="(max-width: 900px) 100vw, 1440px"
              />
            </div>
            <figcaption>
              <span>Jewellery retail is the most unforgiving test</span>
              <span>Mirror finishes beside hand-polished gold tones, security joinery that must look weightless</span>
            </figcaption>
          </figure>
          <div className={styles.tableScroll}>
            <table className={styles.archiveTable}>
              <thead>
                <tr>
                  <th scope="col">Project archive · selected</th>
                  <th scope="col">Place</th>
                  <th scope="col">Scope</th>
                </tr>
              </thead>
              <tbody>
                {projectArchive.map((row) => (
                  <tr key={`${row.project}-${row.place}`}>
                    <td data-label="Project">{row.project}</td>
                    <td data-label="Place">{row.place}</td>
                    <td data-label="Scope">{row.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.footnote}>
            The archive runs deeper than this page: 120+ named projects between 2016 and 2026,
            including Tiffany &amp; Co. programs across Greater China, Asia-Pacific, the Middle East
            and North America.
          </p>
        </div>
      </section>

      {/* 03 PROJECT STORIES */}
      <section className={styles.section} id="project-stories" aria-labelledby="stories-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.kicker}>03 / Selected project stories</span>
              <span className={styles.shortRule} aria-hidden="true" />
            </div>
            <div>
              <h2 id="stories-heading">
                A closer look at <em>the work.</em>
              </h2>
              <p className={styles.sectionSub}>
                Three stories from the portfolio — each one a study in what repeated, considered
                metalwork looks like at building scale.
              </p>
            </div>
          </div>
          <div className={styles.storyGrid}>
            {stories.map((story) => (
              <article className={styles.story} key={story.title}>
                <div className={styles.storyImage}>
                  <Image src={story.image} alt={story.alt} fill sizes="(max-width: 900px) 100vw, 32vw" />
                </div>
                <p className={styles.storyCaption}>{story.caption}</p>
                <h3>{story.title}</h3>
                <p>{story.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04 DESIGN TEAM */}
      <section className={styles.section} id="design-team" aria-labelledby="team-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.kicker}>04 / The design team</span>
              <span className={styles.shortRule} aria-hidden="true" />
            </div>
            <div>
              <h2 id="team-heading">
                Where material meets <em>architectural intent.</em>
              </h2>
              <p className={styles.sectionSub}>
                We approach the conversation through the design itself. What should a surface express?
                How does it meet the surrounding materials? What happens when the light changes? Three
                senior designers lead that translation — from intent to numbers, tolerances and signed
                samples.
              </p>
            </div>
          </div>
          {designers.map((designer) => (
            <article className={styles.designer} key={designer.name}>
              <div className={styles.designerImage}>
                <Image src={designer.image} alt={designer.alt} fill sizes="(max-width: 760px) 100vw, 28vw" />
              </div>
              <div className={styles.designerBody}>
                <h3>{designer.name}</h3>
                <p className={styles.designerRole}>{designer.role}</p>
                <p>{designer.bio}</p>
                <ul className={styles.tagList} aria-label={`${designer.name} focus areas`}>
                  {designer.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          <figure className={styles.sectionFigure}>
            <div className={styles.wideImage}>
              <Image
                src="https://media.guoyaometal.com/about/designer-1.webp"
                alt="The design office — boutique facade drawings pinned for daily review"
                fill
                sizes="(max-width: 900px) 100vw, 1440px"
              />
            </div>
            <figcaption>
              <span>Daily design review</span>
              <span>Every drawing is argued over at the wall before it reaches the shop floor</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 05 INSIDE THE WORKSHOP (dark) */}
      <section className={styles.darkSection} id="workshop" aria-labelledby="workshop-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.kickerDark}>05 / Inside the workshop</span>
              <span className={styles.shortRuleDark} aria-hidden="true" />
            </div>
            <div>
              <h2>
                The making <em>is part of the story.</em>
              </h2>
              <p className={styles.sectionSubDark}>
                A luxury storefront is only as good as its weakest handoff. The answer is to remove
                handoffs: one workshop, one data set, six controlled stages.
              </p>
            </div>
          </div>
          <div className={styles.chainGrid}>
            {workshopStages.map((stage) => (
              <div className={styles.chainItem} key={stage.number}>
                <div className={styles.chainImage}>
                  <Image src={stage.image} alt={stage.alt} fill sizes="(max-width: 900px) 100vw, 32vw" />
                </div>
                <h3>
                  <span>{stage.number}</span> {stage.title}
                </h3>
                <p>{stage.description}</p>
              </div>
            ))}
          </div>
          <p className={styles.pull}>
            Form. Surface. <em>Connection.</em>
            <span>The three things every Guoyao project is judged by</span>
          </p>
          <figure className={styles.sectionFigure}>
            <div className={styles.wideImage}>
              <Image
                src="https://media.guoyaometal.com/about/fac-lab.webp"
                alt="Materials testing laboratory with salt spray chamber and instruments"
                fill
                sizes="(max-width: 900px) 100vw, 1440px"
              />
            </div>
            <figcaption>
              <span>Evidence is manufactured alongside the metal</span>
              <span>Salt-spray chambers, gloss meters and per-batch reports that travel with the crates</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 06 WHY THE SAME NAMES RETURN */}
      <section className={styles.section} id="why-guoyao" aria-labelledby="why-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.kicker}>06 / Why the same names return</span>
              <span className={styles.shortRule} aria-hidden="true" />
            </div>
            <div>
              <h2 id="why-heading">
                Eight reasons, <em>none of them slogans.</em>
              </h2>
            </div>
          </div>
          <div className={styles.whyGrid}>
            {reasons.map((reason, index) => (
              <div className={styles.whyItem} key={reason.title}>
                <h3>
                  <span>{String(index + 1).padStart(2, "0")}</span> {reason.title}
                </h3>
                <p>{reason.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.archiveTable}>
              <thead>
                <tr>
                  <th scope="col">What the client asks</th>
                  <th scope="col">How Guoyao answers</th>
                  <th scope="col">Where it is proven</th>
                </tr>
              </thead>
              <tbody>
                {proofTable.map((row) => (
                  <tr key={row.ask}>
                    <td data-label="The question">&ldquo;{row.ask}&rdquo;</td>
                    <td data-label="The answer">{row.answer}</td>
                    <td data-label="The proof">{row.proof}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figure className={styles.sectionFigure}>
            <div className={styles.wideImage}>
              <Image
                src="https://media.guoyaometal.com/about/museum-dome.webp"
                alt="Perforated steel and aluminium dome casting a rain of light inside a museum atrium"
                fill
                sizes="(max-width: 900px) 100vw, 1440px"
              />
            </div>
            <figcaption>
              <span>In a museum, precision is not decoration — it is the exhibit</span>
              <span>Layered perforated metalwork turning sunlight into a rain of light</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 07 START A CONVERSATION */}
      <section className={styles.section} id="start-conversation" aria-labelledby="start-heading">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>
              <span className={styles.kicker}>07 / Start a conversation</span>
              <span className={styles.shortRule} aria-hidden="true" />
            </div>
            <div>
              <h2 id="start-heading">
                Tell us what <em>you have in mind.</em>
              </h2>
              <p className={styles.sectionSub}>
                A drawing, a reference image or an initial idea. Start with the part of the project you
                are looking to make — a material strategy within one week, samples within eight.
              </p>
            </div>
          </div>
          <div className={styles.startGrid}>
            {startItems.map((item) => (
              <article className={styles.startCard} key={item.number}>
                <p className={styles.startNumber}>{item.number}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className={styles.miniGrid}>
            {miniGallery.map((item) => (
              <figure key={item.caption}>
                <div className={styles.miniImage}>
                  <Image src={item.image} alt={item.alt} fill sizes="(max-width: 760px) 50vw, 22vw" />
                </div>
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className={styles.startConversation}>
            <div>
              <h3>Bring what you have.</h3>
              <p>
                A complete brief is not required to begin. Share your current references and tell us
                which decisions are still open — a material strategy within one week, samples within
                eight.
              </p>
            </div>
            <InquiryButton className={styles.button}>
              Start the conversation <ArrowUpRight size={20} aria-hidden="true" />
            </InquiryButton>
          </div>
          <div className={styles.companyLine}>
            <span>A brand of</span>
            <p lang="zh-CN">{COMPANY_NAME}</p>
            <span>Workshops in Foshan, Guangdong · ISO 9001 since 2014</span>
          </div>
        </div>
      </section>
    </div>
  );
}
