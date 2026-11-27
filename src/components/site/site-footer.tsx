"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { BRIEF_CHECKLIST } from "@/data/homepage-redesign-data";
import { COMPANY_NAME, SALES_EMAIL } from "@/lib/site-identity";
import { InquiryButton } from "./inquiry-contact";
import { EmberField } from "./home-styles/style-10-liquid-effects";
import { FoldedAlloyCanvas } from "./home-styles/style-13-folded-alloy-canvas";
import mirror from "./home-styles/style-10-liquid.module.css";
import alloyStyles from "./home-styles/style-13-folded-alloy.module.css";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/about") return null;

  return (
    <footer className={mirror.footer} aria-labelledby="site-footer-brief-title">
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
            <h2 id="site-footer-brief-title">
              Send your drawings. <span className={mirror.displayItalic}>We’ll shape the alloy.</span>
            </h2>
            <p className={mirror.footerLead}>
              Share architectural plans, surface samples, or concept Rhino models with our Guangzhou
              engineering team for technical feasibility review and sample quoting.
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
          <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
            <a href="#main-content" className={mirror.brand} aria-label="Guoyao Metal, back to top">
              <span className={mirror.brandOrb} aria-hidden="true" />
              <span>GUOYAO</span>
              <span className={mirror.brandSub}>METAL</span>
            </a>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{COMPANY_NAME}</span>
          </div>
          <nav
            className={`${mirror.footerLinks} ${alloyStyles.footerLinks}`}
            aria-label="Footer navigation"
          >
            <Link href="/">Home</Link>
            <Link href="/case-studies">Case Studies</Link>
            <Link href="/blog">Technical Journal</Link>
            <Link href="/about">About Guoyao</Link>
            <a href="#main-content">Back to top ↑</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
