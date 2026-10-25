import Script from "next/script";

// This dedicated Guoyao tag sends data only to its GA4 stream, G-0WRGEBX2MG.
const googleTagId = "GT-T5N2FB37";

export function GoogleAnalytics() {
  // Keep development visits out of the production property.
  if (process.env.NODE_ENV !== "production") return null;

  // GA4 enhanced measurement handles client-side navigation. Do not also
  // send manual page_view events, which would count those visits twice.
  return (
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleTagId}');
        `}
      </Script>
      <Script
        id="google-analytics-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
