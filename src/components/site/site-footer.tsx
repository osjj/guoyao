import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { InquiryButton } from "./inquiry-contact";
import { COMPANY_NAME, SALES_EMAIL, SALES_TELEPHONES } from "@/lib/site-identity";
import styles from "./metal-shell.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner} data-footer-inner>
        <div className={styles.footerInvitation} data-footer-invitation>
          <div><p className={styles.footerKicker}>LET’S MAKE SOMETHING CONSIDERED.</p><h2>Your vision.<br /><em>A new material expression.</em></h2></div>
          <InquiryButton className={styles.footerCta}>Discuss your project <ArrowUpRight size={20} aria-hidden="true" /></InquiryButton>
        </div>
        <div className={styles.footerGrid}>
          <div><Logo variant="white" /><p className={styles.company}>{COMPANY_NAME}</p><p className={styles.footerNote}>Material. Form. Possibility.</p></div>
          <nav aria-label="Footer navigation"><span>EXPLORE</span><Link href="/">Home</Link><Link href="/case-studies">Projects</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link></nav>
          <div className={styles.contacts}><span>START A CONVERSATION</span><a href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}<ArrowUpRight size={15} aria-hidden="true" /></a>{SALES_TELEPHONES.map(phone => <a href={`tel:${phone.replace(/\s/g, "")}`} key={phone}>{phone}</a>)}<p>Guangzhou, China</p></div>
        </div>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} GUOYAO METAL</span><span>ARCHITECTURAL METALWORKS</span><a href="#main-content">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
