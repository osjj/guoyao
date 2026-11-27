"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Layers } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { PublicCaseStudySummary } from "@/lib/public-case-studies";
import { canOptimizeImage } from "@/lib/image-optimization";
import { InquiryButton } from "@/components/site/inquiry-contact";
import { ArchiveState } from "@/components/site/metal-archive-ui";
import { FlutedBrassCanvas } from "@/components/site/alloy-metal-canvases";
import { EmberField } from "@/components/site/home-styles/style-10-liquid-effects";
import mirror from "@/components/site/home-styles/style-10-liquid.module.css";
import styles from "./alloy-subpages.module.css";

function trackCardSheen(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

export function CaseStudiesArchive({ studies }: { studies: PublicCaseStudySummary[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const lead = studies[0];
  const restStudies = useMemo(() => studies.slice(1), [studies]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const study of studies) {
      const cat = study.category?.trim();
      if (!cat) continue;
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    const unique = Array.from(counts.keys());
    const hasConciseLabels = unique.every((cat) => cat.length <= 36);
    const hasSharedCategory = Array.from(counts.values()).some((count) => count > 1);
    return unique.length > 1 && hasConciseLabels && hasSharedCategory ? ["All", ...unique] : [];
  }, [studies]);

  const filteredStudies = useMemo(() => {
    if (selectedCategory === "All") return restStudies;
    return studies.filter((study) => study.category?.trim() === selectedCategory);
  }, [restStudies, selectedCategory, studies]);

  return (
    <div className={styles.page}>
      <section className={styles.casesHero} aria-labelledby="projects-heading">
        <div className={styles.metalHeroCanvasWrap}>
          <FlutedBrassCanvas className={styles.metalHeroCanvas} />
          <EmberField className={mirror.emberCanvas} density={30} />
          <div className={styles.brassHeroScrim} aria-hidden="true" />
        </div>

        <div className={`${mirror.container} ${styles.casesHeroInner}`}>
          <div className={mirror.heroTopRow}>
            <span className={mirror.statusChip}>
              <span className={mirror.liveDot} aria-hidden="true" />
              Fluted Champagne Brass · Selected Works Archive
            </span>
            <span className={mirror.interactPrompt}>
              Move cursor to bend studio light · Click to ripple brass
            </span>
          </div>

          <div className={styles.casesHeroSplit}>
            <div className={styles.casesHeroCopy}>
              <h1 id="projects-heading" className={styles.subHeroTitle}>
                <span className={mirror.chromeText}>Material,</span>
                <span className={mirror.heroItalic}>in context.</span>
              </h1>
              <p className={styles.subHeroLead}>
                From the first shop drawing and finish coupon to full-scale workshop trial assembly
                and site installation—a closer look at the geometry, seams, and alloy decisions
                behind our architectural metalwork.
              </p>
              <div className={mirror.heroActions}>
                <InquiryButton className={mirror.moltenCtaLg}>
                  Discuss Your Project <ArrowUpRight size={17} aria-hidden="true" />
                </InquiryButton>
                {restStudies.length > 0 && (
                  <a href="#project-archive" className={mirror.outlineCta}>
                    Browse {String(studies.length).padStart(2, "0")} Stories{" "}
                    <ArrowDown size={16} aria-hidden="true" />
                  </a>
                )}
              </div>

              <dl className={styles.casesMetrics} aria-label="Project archive overview">
                <div>
                  <dt className={styles.telemetryTerm}>Archive Index</dt>
                  <dd className={styles.telemetryVal}>
                    {String(studies.length).padStart(2, "0")} Published{" "}
                    {studies.length === 1 ? "Project" : "Projects"}
                  </dd>
                </div>
                <div>
                  <dt className={styles.telemetryTerm}>Verification</dt>
                  <dd className={styles.telemetryVal}>1:1 Guangzhou Pre-Assembly</dd>
                </div>
                <div>
                  <dt className={styles.telemetryTerm}>Scope</dt>
                  <dd className={styles.telemetryVal}>Facades · Cladding · Stairs</dd>
                </div>
              </dl>
            </div>

            {lead ? (
              <Link
                href={`/case-studies/${lead.slug}`}
                className={styles.casesLeadPlate}
                onPointerMove={trackCardSheen}
              >
                <div className={styles.casesLeadPlateMedia}>
                  {lead.coverImage ? (
                    <Image
                      src={lead.coverImage}
                      alt={lead.coverImageAlt || lead.title}
                      fill
                      priority
                      unoptimized={!canOptimizeImage(lead.coverImage)}
                      sizes="(max-width: 1020px) 94vw, 58vw"
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>Guoyao Metal / Project 01</div>
                  )}
                  <div className={mirror.caseBadges}>
                    <span>01</span>
                    <span>Featured Case Study</span>
                  </div>
                </div>
                <div className={styles.casesLeadPlateBody}>
                  <p className={mirror.caseCat}>{lead.category}</p>
                  <div className={styles.casesLeadPlateTitleRow}>
                    <h2>{lead.title}</h2>
                    <span
                      className={`${mirror.caseArrowBtn} ${styles.casesLeadPlateArrow}`}
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <p className={styles.casesLeadPlateSummary}>{lead.excerpt}</p>
                </div>
              </Link>
            ) : (
              <ArchiveState type="projects" />
            )}
          </div>
        </div>
      </section>

      {restStudies.length > 0 && (
        <section
          id="project-archive"
          className={styles.archiveSection}
          aria-labelledby="project-archive-heading"
        >
          <div className={mirror.container}>
            <div className={styles.archiveBar}>
              <div>
                <p className={mirror.eyebrow}>
                  <Layers size={13} aria-hidden="true" /> More Project Stories
                </p>
                <h2 id="project-archive-heading" className={mirror.sectionTitle}>
                  Engineered forms,{" "}
                  <span className={mirror.displayItalic}>documented in detail.</span>
                </h2>
                <p className={styles.archiveCount}>
                  Index 02 — {String(studies.length).padStart(2, "0")} ·{" "}
                  {selectedCategory === "All"
                    ? `${restStudies.length} additional documented works`
                    : `Showing ${filteredStudies.length} matching ${filteredStudies.length === 1 ? "work" : "works"}`}
                </p>
              </div>

              {categories.length > 0 && (
                <div
                  className={mirror.filterGroup}
                  role="group"
                  aria-label="Filter case studies by category"
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={selectedCategory === category}
                      className={`${mirror.pillTab} ${
                        selectedCategory === category ? mirror.pillTabActive : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={mirror.caseGrid}>
              {filteredStudies.map((study) => {
                const num = String(studies.indexOf(study) + 1).padStart(2, "0");
                return (
                  <Link
                    key={study.slug}
                    href={`/case-studies/${study.slug}`}
                    className={`${mirror.caseCard} ${styles.archiveCard}`}
                    onPointerMove={trackCardSheen}
                  >
                    <div className={styles.archiveCardVisual}>
                      {study.coverImage ? (
                        <Image
                          src={study.coverImage}
                          alt={study.coverImageAlt || study.title}
                          fill
                          unoptimized={!canOptimizeImage(study.coverImage)}
                          sizes="(max-width: 960px) 100vw, 46vw"
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          Guoyao Metal / Project {num}
                        </div>
                      )}
                      <div className={mirror.caseBadges}>
                        <span>{num}</span>
                        <span>Project Story</span>
                      </div>
                    </div>

                    <div className={mirror.caseBody}>
                      <p className={mirror.caseCat}>{study.category}</p>
                      <div className={mirror.caseTitleRow}>
                        <h3>{study.title}</h3>
                        <span className={mirror.caseArrowBtn} aria-hidden="true">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                      <p className={mirror.caseSummary}>{study.excerpt}</p>
                      <div className={styles.cardCtaRow}>
                        <span>Inside the project</span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
