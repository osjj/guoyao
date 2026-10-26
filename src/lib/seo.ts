import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-identity";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  image: { url: string; alt: string };
};

export function createPageMetadata({ title, description, path, image }: PageMetadata): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
