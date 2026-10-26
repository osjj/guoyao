import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Login is crawlable so its noindex can be read. Other admin routes
      // require authentication; robots.txt is not an access control.
      disallow: ["/api/", "/healthz"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
