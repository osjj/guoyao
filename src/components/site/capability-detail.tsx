import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CAPABILITIES_PATH, type CapabilityPageData } from "@/data/capabilities";
import type { PublicCaseStudySummary } from "@/lib/public-case-studies";
import type { PublicBlogPostSummary } from "@/lib/public-blog";
import { canOptimizeImage } from "@/lib/image-optimization";
import { InquiryButton } from "./inquiry-contact";
import alloy from "./alloy-subpages.module.css";
import styles from "./capabilities.module.css";

export function CapabilityDetail({
  capability,
  caseStudies,
  articles,
}: {
  capability: CapabilityPageData;
  caseStudies: readonly PublicCaseStudySummary[];
  articles: readonly PublicBlogPostSummary[];
}) {
  const { heroImage } = capability;
  const inquiry = { name: capability.inquiryProductName };

  return (
    <div className={`${alloy.page} ${styles.page}`}>
      <header className={`${styles.wrap} ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <Link className={styles.back} href={CAPABILITIES_PATH}><ArrowLeft size={15} aria-hidden="true" /> All capabilities</Link>
          <p className={styles.label}>{capability.eyebrow}</p>
          <h1>{capability.h1}</h1>
          <p className={styles.lead}>{capability.lead}</p>
          <InquiryButton className={styles.action} product={inquiry}>
            Discuss your project <ArrowUpRight size={17} aria-hidden="true" />
          </InquiryButton>
        </div>
        <figure className={styles.heroFigure}>
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            sizes="(max-width: 800px) 92vw, 52vw"
            preload
          />
          <figcaption>{heroImage.caption}</figcaption>
        </figure>
      </header>

      <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="specification-scope">
        <h2 id="specification-scope">{capability.scopeTitle}</h2>
        <div className={styles.tableRegion} role="region" aria-labelledby="specification-scope" tabIndex={0}>
          <table>
            <thead><tr>
              <th scope="col">Typical assemblies</th>
              <th scope="col">Base alloys</th>
              <th scope="col">Finish systems</th>
              <th scope="col">Verification standard</th>
            </tr></thead>
            <tbody>
              {capability.scopeMatrix.map(([assembly, alloy, finish, verification]) => (
                <tr key={assembly}>
                  <th scope="row">{assembly}</th><td>{alloy}</td><td>{finish}</td><td>{verification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${styles.wrap} ${styles.section} ${styles.engineering}`} aria-labelledby="engineering-checks">
        <h2 id="engineering-checks">{capability.engineeringTitle}</h2>
        <ul className={styles.notes}>
          {capability.engineeringHighlights.map(({ title, detail }) => (
            <li key={title}><h3>{title}</h3><p>{detail}</p></li>
          ))}
        </ul>
      </section>

      <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="workshop-evidence">
        <h2 id="workshop-evidence">{capability.proofTitle}</h2>
        {capability.workshopProofGallery.map(({ title, description, photos }) => (
          <div className={styles.proofGroup} key={title}>
            <div className={styles.groupHead}><h3>{title}</h3><p>{description}</p></div>
            <div className={styles.gallery}>
              {photos.map(({ src, alt, caption, width, height }) => (
                <figure key={src}>
                  <Link href={src} target="_blank" rel="noopener noreferrer" aria-label={`View full image: ${alt}`}>
                    <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 650px) 92vw, (max-width: 950px) 45vw, 30vw" />
                  </Link>
                  <figcaption>{caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </section>

      {caseStudies.length > 0 && (
        <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="related-projects">
          <h2 id="related-projects">Published case studies</h2>
          <div className={styles.relatedProjects}>
            {caseStudies.map((study) => (
              <Link key={study.slug} className={styles.projectCard} href={`/case-studies/${study.slug}`}>
                {study.coverImage && (
                  <div className={styles.projectImage}>
                    <Image
                      src={study.coverImage}
                      alt={study.coverImageAlt || study.title}
                      fill
                      unoptimized={!canOptimizeImage(study.coverImage)}
                      sizes="(max-width: 650px) 92vw, 44vw"
                    />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}><h3>{study.title}</h3><ArrowUpRight size={17} aria-hidden="true" /></div>
                  <p>{study.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={`${styles.wrap} ${styles.section} ${styles.engineering}`} aria-labelledby="buyer-faq">
        <h2 id="buyer-faq">Questions before you specify</h2>
        <dl className={styles.faq}>
          {capability.buyerFaqs.map(({ question, answer }) => (
            <div key={question}><dt>{question}</dt><dd>{answer}</dd></div>
          ))}
        </dl>
      </section>

      {articles.length > 0 && (
        <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="related-reading">
          <h2 id="related-reading">Related technical reading</h2>
          <ul className={styles.articleLinks}>
            {articles.map((article) => (
              <li key={article.slug}><Link href={`/blog/${article.slug}`}>{article.title} <ArrowUpRight size={16} aria-hidden="true" /></Link></li>
            ))}
          </ul>
        </section>
      )}

      <section className={`${styles.wrap} ${styles.section} ${styles.closing}`} aria-labelledby="capability-inquiry">
        <div><h2 id="capability-inquiry">Share your project drawings</h2><p>Send the scope, finish references and key site constraints so we can review the work with you.</p></div>
        <InquiryButton className={styles.action} product={inquiry}>
          Start a project enquiry <ArrowUpRight size={17} aria-hidden="true" />
        </InquiryButton>
      </section>
    </div>
  );
}
