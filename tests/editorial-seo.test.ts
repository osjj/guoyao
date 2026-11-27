import assert from "node:assert/strict";
import test from "node:test";
import backlitFacade from "../content/case-drafts/backlit-fluted-metal-boutique-facade.meta.json";
import escalator from "../content/case-drafts/curved-fluted-escalator-atrium-cladding.meta.json";
import entrancePavilion from "../content/case-drafts/elliptical-curved-metal-entrance-pavilion.meta.json";
import staircase from "../content/case-drafts/helical-metal-feature-staircase.meta.json";
import hotelLobby from "../content/case-drafts/luxury-hotel-lobby-brass-vitrines-ffe.meta.json";
import columnCladding from "../content/case-drafts/murray-road-column-cladding.meta.json";
import { getEditorialSeo } from "../src/lib/editorial-seo";

const reviewedCases = [
  [backlitFacade, "Backlit Fluted Metal Boutique Storefront Facade"],
  [escalator, "Double-Curved Fluted Metal Escalator Cladding"],
  [entrancePavilion, "Elliptical Curved Metal Retail Entrance Pavilion"],
  [staircase, "Helical Metal Feature Staircase & Balustrade"],
  [hotelLobby, "Hotel Lobby Brass Display Vitrines & FF&E"],
  [columnCladding, "Double-Curved Stainless Steel Column Cladding"],
] as const;

for (const [{ slug, title, excerpt }, expectedTitle] of reviewedCases) {
  test(`reviewed case metadata is concise for ${slug}`, () => {
    const source = { slug, title, excerpt };
    const metadata = getEditorialSeo("case-studies", source);

    assert.equal(metadata.title, expectedTitle);
    assert.ok(metadata.title.length <= 60);
    assert.ok(metadata.description.length <= 155);
    assert.ok(metadata.description.length < excerpt.length && metadata.description.endsWith("."));
    assert.deepEqual(source, { slug, title, excerpt });
  });
}

test("unknown entries and another editorial kind retain the supplied metadata", () => {
  const source = { slug: "new-project", title: "New project", excerpt: "New project description." };
  assert.deepEqual(getEditorialSeo("case-studies", source), { title: source.title, description: source.excerpt });
  assert.deepEqual(getEditorialSeo("blog", backlitFacade), { title: backlitFacade.title, description: backlitFacade.excerpt });
});

test("changing a reviewed source title disables the old editorial override", () => {
  const source = { ...backlitFacade, title: "Revised storefront project" };
  assert.deepEqual(getEditorialSeo("case-studies", source), { title: source.title, description: source.excerpt });
});

test("a later excerpt edit takes precedence over the reviewed description", () => {
  const source = { ...backlitFacade, excerpt: "A newly edited description of the project." };
  const metadata = getEditorialSeo("case-studies", source);
  assert.equal(metadata.title, "Backlit Fluted Metal Boutique Storefront Facade");
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
