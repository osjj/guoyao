import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import * as cheerio from "cheerio";
import { getSiteUrl } from "../src/lib/site-url";

// Read-only HTTP checks. Run against the local production server before deploy,
// then against the public origin after deploy; no database or GSC writes.
const origin = new URL(process.argv[2] || getSiteUrl()).origin;
const canonicalOrigin = new URL(process.argv[3] || getSiteUrl()).origin;
const output = process.argv[4] || "output/seo-20261026/local-verification.json";
const findings: string[] = [];
const pages: Array<Record<string, unknown>> = [];
const check = (condition: unknown, message: string) => { if (!condition) findings.push(message); };

async function request(path: string) {
  return fetch(new URL(path, origin), {
    redirect: "manual",
    headers: { "User-Agent": "Googlebot", Accept: "text/html,application/xml" },
    signal: AbortSignal.timeout(20000),
  });
}

async function main() {
  const robotsResponse = await request("/robots.txt");
  const robots = await robotsResponse.text();
  check(robotsResponse.status === 200, "robots.txt must return 200");
  check(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), "robots sitemap origin differs from canonical origin");
  check(!/^Disallow:\s*\/\s*$/m.test(robots), "robots.txt blocks the whole site");
  check(!/^Disallow:\s*\/(?:blog|case-studies|about)\b/m.test(robots), "robots.txt blocks public content");

  const sitemapResponse = await request("/sitemap.xml");
  const sitemap = cheerio.load(await sitemapResponse.text(), { xml: true });
  const urls = sitemap("url > loc").toArray().map((element) => sitemap(element).text());
  check(sitemapResponse.status === 200, "sitemap.xml must return 200");
  check(urls.length >= 4 && urls.length === new Set(urls).size, "sitemap must contain unique public URLs");
  const links = new Set<string>();
  for (const url of urls) {
    const canonical = new URL(url);
    check(canonical.origin === canonicalOrigin, `noncanonical sitemap URL: ${url}`);
    check(!/^\/(admin|api|products|guides)(\/|$)/.test(canonical.pathname), `private or retired sitemap URL: ${url}`);
    const response = await request(canonical.pathname);
    const $ = cheerio.load(await response.text());
    const pageRobots = [...$("meta[name='robots'],meta[name='googlebot']").toArray().map((tag) => $(tag).attr("content")), response.headers.get("x-robots-tag")].join(",");
    const title = $("title").text().trim();
    const description = $("meta[name='description']").attr("content")?.trim();
    const pageCanonical = $("link[rel='canonical']").attr("href");
    check(response.status === 200, `${canonical.pathname}: expected 200, got ${response.status}`);
    check(!/noindex/i.test(pageRobots), `${canonical.pathname}: public page is noindex`);
    check(Boolean(title), `${canonical.pathname}: missing title`);
    check(Boolean(description), `${canonical.pathname}: missing description`);
    check($("h1").length === 1, `${canonical.pathname}: expected one H1`);
    check($("link[rel='canonical']").length === 1 && pageCanonical === url, `${canonical.pathname}: canonical does not match sitemap`);
    check($("meta[property='og:url']").attr("content") === url, `${canonical.pathname}: OG URL does not match canonical`);
    const schemaTypes: string[] = [];
    $("script[type='application/ld+json']").each((_, script) => {
      try {
        const schema = JSON.parse($(script).text());
        for (const entity of schema["@graph"] || [schema]) {
          schemaTypes.push(...[entity["@type"]].flat());
        }
      } catch { findings.push(`${canonical.pathname}: invalid JSON-LD`); }
    });
    check(schemaTypes.includes("Organization") && schemaTypes.includes("WebSite"), `${canonical.pathname}: missing site schema`);
    if (/^\/(blog|case-studies)\/.+/.test(canonical.pathname)) {
      check(schemaTypes.includes("Article") && schemaTypes.includes("BreadcrumbList"), `${canonical.pathname}: missing article/breadcrumb schema`);
    }
    $("a[href]").each((_, element) => {
      const href = $(element).attr("href")!;
      try {
        const link = new URL(href, url);
        if (link.origin === canonicalOrigin && !/^\/(admin|api|cdn-cgi)(\/|$)/.test(link.pathname)) links.add(`${link.pathname}${link.search}`);
      } catch { findings.push(`${canonical.pathname}: invalid link ${href}`); }
    });
    pages.push({ path: canonical.pathname, status: response.status, title, description, canonical: pageCanonical, h1: $("h1").text().trim(), schemaTypes });
  }

  const sitemapPaths = new Set(urls.map((url) => new URL(url).pathname));
  for (const path of links) {
    if (sitemapPaths.has(path)) continue;
    const response = await request(path);
    check(response.status >= 200 && response.status < 400, `broken internal link ${path}: ${response.status}`);
    await response.body?.cancel();
  }
  const special: Array<Record<string, unknown>> = [];
  for (const path of ["/products", "/products/legacy-glassware", "/products/category/drinkware", "/guides/shot-glass-sourcing", "/blog/seo-check-missing-page", "/case-studies/seo-check-missing-page", "/seo-check-missing-page"]) {
    const response = await request(path);
    check(response.status === 404, `${path}: expected 404, got ${response.status}`);
    special.push({ path, status: response.status });
    await response.body?.cancel();
  }
  for (const path of ["/admin/login", "/admin", "/healthz", "/api/inquiries"]) {
    const response = await request(path);
    check(/noindex/.test(response.headers.get("x-robots-tag") || ""), `${path}: missing noindex response header`);
    special.push({ path, status: response.status, robots: response.headers.get("x-robots-tag") });
    await response.body?.cancel();
  }
  const guides = await request("/guides");
  check(guides.status === 308 && guides.headers.get("location") === "/blog", "/guides must permanently redirect to /blog");
  await guides.body?.cancel();
  const report = { checkedAt: new Date().toISOString(), origin, canonicalOrigin, sitemapUrlCount: urls.length, internalLinkCount: links.size, findings, pages, special };
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ output, sitemapUrlCount: urls.length, internalLinkCount: links.size, findings }, null, 2));
  if (findings.length) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
