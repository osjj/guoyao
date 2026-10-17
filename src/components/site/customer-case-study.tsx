import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { CustomerCaseStudy as CustomerProject } from "@/data/shangri-la-case-study";
import { getCaseSectionImages, getCaseVideoSectionId } from "@/lib/case-study-content";
import { CaseStudyImageGallery } from "./case-study-image-gallery";
import { CaseStudyVideoPlayer } from "./case-study-video";
import { InquiryButton } from "./inquiry-contact";
import theme from "./editorial-pages.module.css";
import reading from "./reading-pages.module.css";
import styles from "./customer-case-study.module.css";

export function CustomerCaseStudy({ study }: { study: CustomerProject }) {
  const videoSectionId = getCaseVideoSectionId(study.sections);
  return (
    <>
      <div className={`${theme.container} ${reading.intro}`}><aside aria-label="Project introduction">{study.introduction}</aside></div>
      <div className={`${theme.container} ${styles.overview}`}>
        <dl className={styles.stats} aria-label="Project at a glance">
          {study.stats.map((stat) => <div className={styles.stat} key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}
        </dl>
      </div>
      <div className={`${theme.container} ${reading.readingLayout}`}>
        <div className={reading.caseBody}>
          {study.video && <section id={videoSectionId} className={styles.section} aria-label={study.video.title}>
            <p className={styles.number}>Project video</p>
            <h2>{study.video.title}</h2>
            <CaseStudyVideoPlayer video={study.video} />
          </section>}
          {study.sections.map((section, index) => (
            <section id={section.id} className={styles.section} key={section.id}>
              <p className={styles.number}>{String(index + 1).padStart(2, "0")} / {section.navLabel}</p>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <CaseStudyImageGallery images={getCaseSectionImages(section)} label={section.title} />
              {section.video && <CaseStudyVideoPlayer video={section.video} />}
              {section.points && <ul className={styles.points}>{section.points.map((point) => <li key={point.title}><h3>{point.title}</h3><p>{point.text}</p></li>)}</ul>}
              {section.table && <div className={styles.tableWrap}>
                <table><caption>{section.table.caption}</caption>
                  <thead><tr>{section.table.headings.map((heading) => <th scope="col" key={heading}>{heading}</th>)}</tr></thead>
                  <tbody>{section.table.rows.map((row) => <tr key={row[0]}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>}
            </section>
          ))}
          <section id="your-project" className={`${reading.approval} mt-12 text-white`}>
            <h2>Plan your glassware project with Glarivo</h2>
            <p>{study.conclusion}</p>
            <InquiryButton className={theme.button}>Discuss your project<ArrowRight size={18} aria-hidden="true" /></InquiryButton>
          </section>
        </div>
        <aside className={reading.sidebar}>
          <nav aria-label="On this page">
            <h2>In this customer case</h2>
            <ul className={styles.contents}>
              {study.video && <li><a href={`#${videoSectionId}`}>Project video</a></li>}
              {study.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.navLabel}</a></li>)}
              <li><a href="#your-project">Discuss your project</a></li>
            </ul>
          </nav>
          <div className={styles.links}><h2>Related reading & collections</h2><ul>
            {study.relatedLinks.map((link) => <li key={link.href}><Link href={link.href}>{link.label}<ArrowRight size={17} aria-hidden="true" /></Link></li>)}
          </ul></div>
        </aside>
      </div>
    </>
  );
}
