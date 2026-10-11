import {
  SALES_EMAIL,
  SALES_TELEPHONES,
  SITE_ALTERNATE_NAME,
  SITE_NAME,
  COMPANY_NAME,
} from "@/lib/site-identity";
import { getSiteUrl } from "@/lib/site-url";

export function SiteStructuredData() {
  const siteUrl = getSiteUrl();
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const logoUrl = `${siteUrl}/brand/guoyao-logo-source.png`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        legalName: COMPANY_NAME,
        alternateName: SITE_ALTERNATE_NAME,
        url: `${siteUrl}/`,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
          contentUrl: logoUrl,
          width: 1254,
          height: 1254,
        },
        email: SALES_EMAIL,
        telephone: SALES_TELEPHONES,
        address: {
          "@type": "PostalAddress",
          addressRegion: "Guangdong",
          addressLocality: "Guangzhou",
          addressCountry: "CN",
        },
        contactPoint: SALES_TELEPHONES.map((telephone) => ({
          "@type": "ContactPoint",
          contactType: "sales",
          telephone,
          email: SALES_EMAIL,
        })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${siteUrl}/`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAME,
        publisher: { "@id": organizationId },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

