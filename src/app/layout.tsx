import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, DM_Sans } from "next/font/google";
import { SITE_NAME } from "@/lib/site-identity";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-home-sans",
  display: "swap",
});

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-home-display",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | Architectural Metalworks`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A material perspective on architecture. Discover Guoyao Metal, architectural metalwork, design studies and ideas for considered spaces.",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Architectural Metalworks`,
    description:
      "Metal, made remarkable. Architectural metalworks and a considered approach to material, form and detail.",
    url: siteUrl,
    images: [{ url: "/images/home-projects/extra/cartier-night.webp", alt: "Geometric architectural metal storefront facade at night" }],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#22231f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
