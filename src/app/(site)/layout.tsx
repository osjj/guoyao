import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { InquiryProvider } from "@/components/site/inquiry-contact";
import { GoogleAnalytics } from "@/components/site/google-analytics";
import { SiteStructuredData } from "@/components/site/site-structured-data";
import { atelierDisplay, atelierSerif } from "@/components/site/atelier-fonts";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <InquiryProvider>
      <div className={`metal-site ${atelierDisplay.variable} ${atelierSerif.variable}`}>
        <a className="metal-skip-link" href="#main-content">Skip to content</a>
        <SiteStructuredData />
        <SiteHeader />
        <main id="main-content" className="metal-main" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <GoogleAnalytics />
      </div>
    </InquiryProvider>
  );
}
