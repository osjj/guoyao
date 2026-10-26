import assert from "node:assert/strict";
import test from "node:test";
import { getEditorialSeo } from "../src/lib/editorial-seo";

const caseStudy = {
  slug: "tiffany-boutique-backlit-facade",
  title: "Tiffany & Co. Boutique Backlit Facade — From Inquiry to Acceptance",
  excerpt: "How Guoyao Metalwork delivered a backlit fluted silver facade and illuminated TIFFANY & CO. lettering for luxury boutiques in China — 18 documented stages from the first inquiry through fabrication, mock-up, export packing and site installation to final acceptance and aftercare.",
};

test("reviewed case metadata is concise while source content stays intact", () => {
  const original = { ...caseStudy };
  const metadata = getEditorialSeo("case-studies", caseStudy);
  assert.equal(metadata.title, "Tiffany & Co. Backlit Metal Facade");
  assert.ok(metadata.description.length < caseStudy.excerpt.length);
  assert.ok(metadata.description.endsWith("."));
  assert.ok(!metadata.title.includes("GUOYAO METAL"));
  assert.deepEqual(caseStudy, original);
});

test("unknown entries and another editorial kind retain the supplied metadata", () => {
  const source = { slug: "new-project", title: "New project", excerpt: "New project description." };
  assert.deepEqual(getEditorialSeo("case-studies", source), { title: source.title, description: source.excerpt });
  assert.deepEqual(getEditorialSeo("blog", caseStudy), { title: caseStudy.title, description: caseStudy.excerpt });
});

test("changing a reviewed source title disables the old editorial override", () => {
  const source = { ...caseStudy, title: "Revised Tiffany project" };
  assert.deepEqual(getEditorialSeo("case-studies", source), { title: source.title, description: source.excerpt });
});

test("a later excerpt edit takes precedence over the reviewed description", () => {
  const source = { ...caseStudy, excerpt: "A newly edited description of the project." };
  const metadata = getEditorialSeo("case-studies", source);
  assert.equal(metadata.title, "Tiffany & Co. Backlit Metal Facade");
  assert.equal(metadata.description, source.excerpt);
});

test("reviewed blog metadata uses the blog namespace and keeps technical scope", () => {
  const source = {
    slug: "metalwork-welding-process-and-quality-control",
    title: "High-End Metalwork Welding: Full-Process Workmanship Standard",
    excerpt: "A full-process welding workmanship standard for luxury retail, residence and hotel interiors: weld grade zoning, the ten-step process chain, base-metal and filler matching, TIG and laser welding parameters, groove design, distortion control, post-weld finishing, defect prevention and acceptance criteria.",
  };
  const metadata = getEditorialSeo("blog", source);
  assert.equal(metadata.title, "High-End Metalwork Welding & Quality Control");
  assert.match(metadata.description, /TIG and laser welding/);
  assert.ok(metadata.description.length <= 160);
});
