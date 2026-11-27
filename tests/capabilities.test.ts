import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  CAPABILITIES,
  CAPABILITIES_OVERVIEW,
  CAPABILITIES_PATH,
  CAPABILITY_LINKS,
  capabilityPath,
  getCapabilityBySlug,
  type CapabilityPhoto,
} from "../src/data/capabilities";
import { DISCIPLINES, PREFERRED_FEATURED_ARTICLE_SLUG } from "../src/data/homepage-redesign-data";
import { parseArticleEditorJson } from "../src/lib/article-content";
import { getEditorialSeo } from "../src/lib/editorial-seo";
import { inquiryAttribution, inquiryMessage } from "../src/lib/inquiries";
import { COMPANY_NAME, PRIMARY_NAVIGATION } from "../src/lib/site-identity";

const expected = [
  ["storefront-facades", "Storefronts & Facades", 5],
  ["curved-architectural-cladding", "Curved Cladding", 7],
  ["custom-staircases-balustrades", "Stairs & Balustrades", 10],
  ["display-vitrines-hospitality-ffe", "Display Vitrines & FF&E", 9],
] as const;
const blogSlugs = [
  PREFERRED_FEATURED_ARTICLE_SLUG,
  "why-1-to-1-factory-trial-assembly-matters-curved-metalwork",
  "stainless-steel-304-vs-316l-brass-bronze-commercial-projects",
  "how-to-prepare-rfq-package-custom-architectural-metalwork",
] as const;

function checkPhoto({ src, alt, caption, width, height }: CapabilityPhoto) {
  assert.match(src, /^\/images\/capabilities\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/);
  assert.ok(statSync(path.join("public", src)).isFile(), src);
  assert.ok(width > 0 && height > 0 && Math.max(width, height) <= 1600, src);
  assert.ok(alt.trim() && caption.trim(), src);
}

test("the four capability slugs, archive categories and home links match", () => {
  assert.equal(CAPABILITIES.length, 4);
  assert.equal(new Set(CAPABILITIES.map((page) => page.slug)).size, 4);
  assert.deepEqual(CAPABILITIES.map(({ slug, categoryMatch }) => [slug, categoryMatch]), expected.map(([slug, category]) => [slug, category]));
  assert.deepEqual(CAPABILITIES.map(({ slug }) => capabilityPath(slug)), DISCIPLINES.map(({ href }) => href));
  assert.deepEqual(CAPABILITY_LINKS.map(({ href }) => href), DISCIPLINES.map(({ href }) => href));
  assert.equal(getCapabilityBySlug("non-existent"), undefined);
  assert.deepEqual(PRIMARY_NAVIGATION.map(({ href }) => href), ["/", CAPABILITIES_PATH, "/case-studies", "/blog", "/about"]);
  assert.equal(COMPANY_NAME, "广州市国耀高薪材料科技有限公司");
});

test("capability copy, specifications, galleries, FAQs and links are valid", () => {
  for (const page of [CAPABILITIES_OVERVIEW, ...CAPABILITIES]) {
    assert.ok(page.seoTitle.length > 0 && page.seoTitle.length <= 65, page.h1);
    assert.ok(page.seoDescription.length > 0 && page.seoDescription.length <= 160, page.h1);
    checkPhoto(page.heroImage);
  }

  const questions = new Set<string>();
  const images = new Set<string>();
  for (const page of CAPABILITIES) {
    assert.ok(page.scopeMatrix.length >= 3, page.slug);
    for (const row of page.scopeMatrix) {
      assert.equal(row.length, 4, page.slug);
      assert.ok(row.every((cell) => cell.trim()), page.slug);
    }
    assert.ok(page.engineeringHighlights.length >= 3 && page.engineeringHighlights.length <= 4, page.slug);
    assert.ok(page.buyerFaqs.length >= 4 && page.buyerFaqs.length <= 5, page.slug);
    for (const { question, answer } of page.buyerFaqs) {
      assert.ok(question.trim() && answer.trim(), page.slug);
      assert.ok(!questions.has(question), question);
      questions.add(question);
    }
    const gallery = page.workshopProofGallery.flatMap(({ photos }) => photos);
    assert.equal(gallery.length, expected.find(([slug]) => slug === page.slug)?.[2]);
    for (const photo of gallery) {
      checkPhoto(photo);
      assert.ok(!images.has(photo.src), photo.src);
      images.add(photo.src);
    }
    assert.equal(new Set(page.relatedBlogSlugs).size, page.relatedBlogSlugs.length);
    for (const slug of page.relatedBlogSlugs) assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.doesNotMatch(JSON.stringify(page), /\/(?:products|guides)(?:\/|["?#])/i);
  }
});

test("capability inquiry uses the actual page path and distinct prefill text", () => {
  const names = new Set<string>();
  for (const page of [CAPABILITIES_OVERVIEW, ...CAPABILITIES]) {
    const sourcePath = "slug" in page ? capabilityPath(page.slug) : CAPABILITIES_PATH;
    const product = { name: page.inquiryProductName };
    assert.ok(!names.has(product.name));
    names.add(product.name);
    assert.ok(inquiryMessage(product).includes(product.name));
    assert.deepEqual(inquiryAttribution(sourcePath, "?fromArticle=unknown", product), {
      sourcePath, productSlug: undefined, brief: undefined,
    });
  }
});

test("the four blog drafts have import manifests and curated metadata with the same source copy", () => {
  for (const slug of blogSlugs) {
    const name = path.join("content", "drafts", slug);
    const meta = JSON.parse(readFileSync(`${name}.meta.json`, "utf8"));
    const draft = JSON.parse(readFileSync(`${name}.draft.json`, "utf8"));
    assert.equal(meta.slug, slug);
    assert.equal(draft.status, "DRAFT");
    assert.equal(meta.status, "DRAFT");
    assert.equal(draft.publishedAt, null);
    assert.equal(draft.title, meta.title);
    assert.equal(draft.excerpt, meta.excerpt);
    const seo = getEditorialSeo("blog", meta);
    assert.notEqual(seo.title, meta.title, slug);
    assert.notEqual(seo.description, meta.excerpt, slug);
    assert.ok(seo.title.length <= 60 && seo.description.length <= 155, slug);
    const content = parseArticleEditorJson(draft.content);
    assert.ok(content && content.blocks.some(({ type }) => type === "list"), slug);
    assert.equal(content.blocks.filter(({ type }) => type === "image").length, meta.images.length);
    for (const { file } of [meta.cover, ...meta.images]) assert.ok(statSync(path.join(meta.sourceDir, file)).isFile(), slug);
    assert.doesNotMatch(draft.content, /href=\\"?[^"]*\/(?:products|guides)(?:\/|\\"|["?#])/i);
  }
});
