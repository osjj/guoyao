import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { InquiryButton } from "@/components/site/inquiry-contact";
import { MetalMotion } from "@/components/site/metal-motion";
import { ProjectGallery } from "@/components/site/project-gallery";
import { ProjectBrands } from "@/components/site/project-brands";
import { ProjectRecordsCarousel } from "@/components/site/project-records-carousel";
import { homepageGalleryItems } from "@/data/homepage-gallery";
import { projectRecords } from "@/data/project-experience";
import { createPageMetadata } from "@/lib/seo";
import styles from "./home.module.css";

const extra = "/images/home-projects/extra/";
const imageSrc = (image: string) => image.startsWith("/") ? image : `${extra}${image}`;
const stories = [
  { title: "Reflective boutique facades", name: "Tiffany & Co. boutique facade", stage: "Installed view", image: "/images/home-projects/hero-tiffany.webp", alt: "Complete front view of a Tiffany boutique with reflective metal facade elements", text: "Repeated surfaces, changing reflections and the character of a storefront.", href: "/case-studies/tiffany-boutique-backlit-facade" },
  { title: "Sculptural column cladding", name: "Curved architectural metalwork", stage: "Workshop pre-assembly", image: "/images/home-projects/column-assembly.webp", alt: "Tall sculptural metal column cladding during workshop pre-assembly", text: "The scale of a curved form, seen together with its panel divisions and junctions.", href: "/case-studies/murray-road-column-cladding" },
  { title: "A curved entrance framework", name: "Lancôme entrance framework", stage: "Workshop pre-assembly", image: "/images/home-projects/lancome-assembly.webp", alt: "Curved Lancôme entrance framework being pre-assembled in the workshop", text: "An entrance structure, with its curved profile and framework still in view.", href: "/case-studies/lancome-boutique-entrance-pavilion" },
] as const;

const applications = [
  { number: "01", title: "Storefronts", image: "piaget-framework.webp", alt: "PIAGET entrance and storefront framework during workshop pre-assembly", stage: "Workshop pre-assembly", text: "Metal facades, entrance frames and the details that give a retail space its identity.", inquiry: "storefront and entrance metalwork" },
  { number: "02", title: "Curved cladding", image: "escalator-form.webp", alt: "Flowing ribbed metal cladding photographed in workshop assembly", stage: "Workshop pre-assembly", text: "Shaped panels, column covers and decorative surfaces with a sculptural character.", inquiry: "curved architectural metal cladding" },
  { number: "03", title: "Stairs & rails", image: "long-balustrade.webp", alt: "Long balustrade sections and their support framework during workshop pre-assembly", stage: "Workshop pre-assembly", text: "Balustrades, handrail profiles and the transitions between one level and another.", inquiry: "stair balustrades and handrails" },
  { number: "04", title: "Display fixtures", image: "/images/home-projects/display-counter.webp", alt: "Curved gold-toned ribbed metal display counter photographed in the workshop", stage: "Workshop view", text: "Counters, glass display cabinets and freestanding pieces for considered presentation.", inquiry: "metal display cabinets and retail fixtures" },
] as const;

const workshopViews = [
  { image: "/images/home-projects/column-parts.webp", title: "A form, in sections", detail: "Formed panels / work in progress", alt: "Individual formed metal cladding panels laid out in the workshop before assembly" },
  { image: "display-lighting-back.webp", title: "Beyond the display surface", detail: "Lighting assembly / workshop detail", alt: "Back of an illuminated display fixture showing its lighting and workshop assembly" },
  { image: "entrance-joint-detail.webp", title: "The point of connection", detail: "Entrance framework / workshop detail", alt: "Connection detail of a curved metal entrance framework" },
  { image: "/images/home-projects/handrail-connection.webp", title: "Following the profile", detail: "Handrail connection / work in progress", alt: "Close view of a handrail support and welded connection during workshop fabrication" },
  { image: "illuminated-facade-module.webp", title: "Metal, seen in light", detail: "Facade module / workshop lighting view", alt: "Illuminated lettering and reflective facade elements in a workshop view" },
  { image: "protected-components.webp", title: "Protecting the component", detail: "Protective wrapping / workshop view", alt: "Metal components protected with wrapping before handling" },
] as const;

export const metadata = createPageMetadata({
  title: "GUOYAO METAL | Custom Architectural Metalwork",
  description: "Explore Guoyao Metal projects and workshop photographs: retail facades, curved architectural cladding, stair balustrades and custom display fixtures.",
  path: "/",
  image: { url: "/images/home-projects/extra/cartier-night.webp", alt: "Geometric metal storefront facade photographed at night" },
});

export default function HomePage() {
  return (
    <MetalMotion className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.container}>
          <div className={styles.heroIntro}>
            <div><p className={styles.kicker}>GUOYAO METAL / ARCHITECTURAL METALWORK</p><h1 id="home-title">Metalwork.<br /><em>With presence.</em></h1></div>
            <div className={styles.heroBrief}><p>Custom architectural metalwork for retail facades, curved cladding, stairs and display fixtures. Explore Guoyao Metal projects through installed views, workshop photographs and fabrication details.</p><div className={styles.heroActions}><a href="#project-gallery" className={styles.darkButton}>Explore the collection <ArrowDown size={16} aria-hidden="true" /></a><InquiryButton className={styles.textLink}>Discuss a project <ArrowUpRight size={16} aria-hidden="true" /></InquiryButton></div></div>
          </div>
          <div className={styles.heroMosaic}>
            <figure className={styles.heroMain}><div className={styles.heroPhoto}><Image src={`${extra}cartier-night.webp`} alt="Installed geometric metal storefront facade with illuminated Cartier lettering at night" fill preload sizes="(max-width: 850px) calc(100vw - 40px), 66vw" /></div><figcaption><div><span>RETAIL / INSTALLED VIEW</span><p>A facade with a different rhythm.</p></div><a href="#project-gallery" aria-label="Explore the project photograph collection"><ArrowUpRight size={22} aria-hidden="true" /></a></figcaption></figure>
            <div className={styles.heroSide}>
              <figure><div className={styles.heroPhoto}><Image src={`${extra}tiffany-corner.webp`} alt="Reflective metal facade around the corner of a Tiffany boutique" fill sizes="(max-width: 700px) 66vw, 45vw" /></div><figcaption><div><span>RETAIL / INSTALLED VIEW</span><p>Reflection, around the corner.</p></div></figcaption></figure>
              <figure><div className={styles.heroPhoto}><Image src={`${extra}staircase-site.webp`} alt="Curved metal balustrade on a staircase photographed during site work" fill sizes="(max-width: 700px) 66vw, 45vw" /></div><figcaption><div><span>STAIRS / ON-SITE WORK</span><p>A line through the space.</p></div></figcaption></figure>
            </div>
          </div>
          <div className={styles.heroFoot}><span>STOREFRONTS & ENTRANCES</span><span>ARCHITECTURAL CLADDING</span><span>STAIRS & BALUSTRADES</span><span>DISPLAYS & FIXTURES</span></div>
        </div>
      </section>

      <ProjectBrands />

      <section className={styles.stories} id="selected-projects" aria-labelledby="stories-title"><div className={styles.container}>
        <div className={styles.sectionHead} data-index="01" data-metal-reveal><div><p className={styles.kicker}>01 / SELECTED PROJECT STORIES</p><h2 id="stories-title">A closer look at <em>the work.</em></h2></div><Link href="/case-studies" className={styles.textLink}>All project stories <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        <div className={styles.storyGrid}>{stories.map((story,index)=><article className={styles.storyCard} key={story.href} data-metal-reveal><Link href={story.href} className={styles.storyImageLink} aria-label={`View ${story.name}`}><div className={styles.storyImage}><Image src={imageSrc(story.image)} alt={story.alt} fill sizes="(max-width: 700px) calc(100vw - 40px), 40vw" /></div></Link><div className={styles.storyMeta}><span>{story.stage}</span><span>0{index+1}</span></div><Link href={story.href} className={styles.storyTitle}><h3>{story.title}</h3><ArrowUpRight size={19} aria-hidden="true" /></Link><p>{story.text}</p></article>)}</div>
      </div></section>

      <ProjectRecordsCarousel items={projectRecords} />

      <section className={styles.applications} id="applications" aria-labelledby="applications-title"><div className={styles.container}>
        <div className={styles.sectionHead} data-index="02" data-metal-reveal><div><p className={styles.kicker}>02 / WHAT WE MAKE</p><h2 id="applications-title">Different settings.<br /><em>A shared material language.</em></h2></div><p className={styles.sectionDescription}>From a building’s first impression to the smallest feature within it.</p></div>
        <div className={styles.applicationGrid}>{applications.map(application=><article className={styles.applicationCard} key={application.number} data-metal-reveal><div className={styles.applicationImage}><Image src={imageSrc(application.image)} alt={application.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 90vw, 48vw" /></div><div className={styles.applicationMeta}><span>{application.number}</span><span>{application.stage}</span></div><h3>{application.title}</h3><p>{application.text}</p><InquiryButton className={styles.applicationLink} product={{name:application.inquiry}}>Discuss this application <ArrowUpRight size={15} aria-hidden="true" /></InquiryButton></article>)}</div>
      </div></section>

      <ProjectGallery items={homepageGalleryItems} />

      <section className={styles.workshop} id="workshop" aria-labelledby="workshop-title"><div className={styles.container}>
        <div className={styles.sectionHead} data-index="04" data-metal-reveal><div><p className={styles.kickerLight}>04 / INSIDE THE WORKSHOP</p><h2 id="workshop-title">The making <em>is part of the story.</em></h2></div><p className={styles.workshopIntro}>A collection of workshop moments from different projects: frameworks, profiles, connections, lighting and protective packing.</p></div>
        <div className={styles.workshopGrid}>{workshopViews.map((view,index)=><figure key={view.image} data-metal-reveal><div className={styles.workshopImage}><Image src={imageSrc(view.image)} alt={view.alt} fill sizes={index < 2 ? "(max-width: 700px) calc(100vw - 40px), 50vw" : "(max-width: 700px) 60vw, 35vw"} /></div><figcaption><h3>{view.title}</h3><p>{view.detail}</p></figcaption></figure>)}</div>
        <div className={styles.workshopBottom}><p>Form. Surface. Connection.</p><a href="#project-gallery" className={styles.lightLink}>Explore more photographs <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      </div></section>

      <section className={styles.projectBrief} aria-labelledby="brief-title"><div className={`${styles.container} ${styles.briefGrid}`}>
        <div><p className={styles.kicker}>05 / START A CONVERSATION</p><h2 id="brief-title">Tell us what<br /><em>you have in mind.</em></h2><p className={styles.briefDescription}>A drawing, a reference image or an initial idea. Start with the part of the project you are looking to make.</p><InquiryButton className={styles.darkButton}>Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></InquiryButton></div>
        <div className={styles.briefList}><p>A few useful starting points</p><div><span>01</span><p>Project location & application</p></div><div><span>02</span><p>Drawings & approximate dimensions</p></div><div><span>03</span><p>Quantities & finish references</p></div><Link href="/about" className={styles.textLink}>Meet Guoyao Metal <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      </div></section>
    </MetalMotion>
  );
}
