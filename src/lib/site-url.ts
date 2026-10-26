import { DEFAULT_SITE_URL } from "@/lib/site-identity";

export function resolveSiteUrl(configuredUrl?: string) {
  if (!configuredUrl) return DEFAULT_SITE_URL;

  try {
    const url = new URL(configuredUrl.trim());
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
      return DEFAULT_SITE_URL;
    }

    // The public origin redirects to www. Keep every canonical, schema and
    // sitemap URL aligned even if an older deployment still configures the apex.
    if (["guoyaometal.com", "www.guoyaometal.com"].includes(url.hostname)) {
      return DEFAULT_SITE_URL;
    }

    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getSiteUrl() {
  return resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}
