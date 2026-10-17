import assert from "node:assert/strict";
import test from "node:test";
import { caseStudyContentSchema, caseVideoPosterUrl, caseVideoUrl, getCaseVideoSectionId, getCaseSectionImages, MAX_CASE_SECTION_IMAGES, isCasePublished } from "../src/lib/case-study-content";
import { shangriLaCaseStudy } from "../src/data/shangri-la-case-study";

const exampleContent = {
  introduction: shangriLaCaseStudy.introduction,
  stats: shangriLaCaseStudy.stats,
  sections: shangriLaCaseStudy.sections,
  conclusion: shangriLaCaseStudy.conclusion,
  relatedLinks: shangriLaCaseStudy.relatedLinks,
};

test("draft, archived, undated and future cases remain private", () => {
  const now = new Date("2026-09-19T00:00:00Z");
  for (const status of ["DRAFT", "ARCHIVED"]) assert.equal(isCasePublished({ status, publishedAt: new Date("2026-09-01") }, now), false);
  assert.equal(isCasePublished({ status: "PUBLISHED", publishedAt: null }, now), false);
  assert.equal(isCasePublished({ status: "PUBLISHED", publishedAt: new Date("2026-09-20") }, now), false);
  assert.equal(isCasePublished({ status: "PUBLISHED", publishedAt: now }, now), true);
});
test("case content keeps tables and rejects duplicate anchors and unsafe links", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  assert.equal(content.sections.filter(section => section.table).length, 2);
  assert.equal(caseStudyContentSchema.safeParse({ ...content, sections: [content.sections[0], content.sections[0]] }).success, false);
  assert.equal(caseStudyContentSchema.safeParse({ ...content, relatedLinks: [{ label: "Unsafe", href: "javascript:alert(1)" }] }).success, false);
  assert.equal(caseStudyContentSchema.safeParse({ ...content, relatedLinks: [{ label: "Unsafe", href: "//external.example" }] }).success, false);
});
test("images require descriptive alt text and table rows match column count", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  content.sections[0].image = { url: "/images/example.webp", alt: "", caption: "" };
  assert.equal(caseStudyContentSchema.safeParse(content).success, false);
  delete content.sections[0].image;
  content.sections[1].table!.rows[0].pop();
  assert.equal(caseStudyContentSchema.safeParse(content).success, false);
});

test("existing cases keep their content with no video, while optional video round-trips", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  assert.equal(Object.hasOwn(content, "video"), false);
  const video = { url: "https://media.example.com/project.mp4?version=2", title: "Project walkthrough", caption: "Finished metalwork", poster: "/images/project.webp" };
  assert.deepEqual(caseStudyContentSchema.parse({ ...content, video }), { ...content, video });
  assert.equal(caseStudyContentSchema.safeParse({ ...content, video: { ...video, title: " " } }).success, false);
  assert.equal(caseStudyContentSchema.safeParse({ ...content, video: { ...video, poster: "javascript:alert(1)" } }).success, false);
});

test("video URLs accept direct MP4 and WebM files with query strings", () => {
  for (const url of ["https://media.example.com/project.mp4", "http://media.example.com/project.webm?token=abc&download=1", "/videos/project.MP4?version=2#t=3", "/videos/project.webm", " https://media.example.com/project.mp4 "]) {
    assert.equal(caseVideoUrl.parse(url), url.trim());
  }
  assert.equal(caseVideoPosterUrl.safeParse("https://media.example.com/poster.webp?v=2").success, true);
  assert.equal(caseVideoPosterUrl.safeParse("/images/poster.jpg").success, true);
});

test("video and poster URLs reject unsafe and malformed addresses", () => {
  for (const url of ["", "//media.example.com/project.mp4", "/\\media.example.com/project.mp4", "https://media.example.com\\project.mp4", "javascript:alert(1)", "data:video/mp4;base64,AAAA", "blob:https://example.com/video.mp4", "ftp://media.example.com/project.mp4", "https:///media.example.com/project.mp4", "https://", "https://user:pass@media.example.com/project.mp4", "https://media.example.com/proj\nect.mp4", "/videos/project.mp4\n", "/videos/%5cproject.mp4", "/videos/%0aproject.mp4"]) {
    assert.equal(caseVideoUrl.safeParse(url).success, false, url);
    assert.equal(caseVideoPosterUrl.safeParse(url).success, false, url);
  }
  for (const url of ["/videos/project.mov", "https://youtu.be/example", "https://media.example.com/watch?file=project.mp4", "/videos/project.mp4.html", "videos/project.mp4"]) {
    assert.equal(caseVideoUrl.safeParse(url).success, false, url);
  }
});

test("video anchors do not invalidate or collide with existing chapter IDs", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  const sections = ["project-video", "project-video-2", "project-video-3"].map(id => ({ ...content.sections[0], id }));
  assert.equal(caseStudyContentSchema.safeParse({ ...content, sections }).success, true);
  assert.equal(getCaseVideoSectionId(content.sections), "project-video");
  assert.equal(getCaseVideoSectionId(sections), "project-video-4");
});

test("54 chapter images survive save/read round-trip alongside legacy images and video", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  const images = Array.from({ length: 54 }, (_, index) => ({ url: `/images/project-${index + 1}.webp`, alt: `Project detail ${index + 1}`, caption: `Caption ${index + 1}` }));
  content.sections[0].images = images;
  content.sections[1].image = { url: "/images/legacy.webp", alt: "Original project image", caption: "Original caption" };
  content.video = { url: "/videos/project.mp4", title: "Project film", caption: "" };
  const roundTrip = caseStudyContentSchema.parse(JSON.parse(JSON.stringify(content)));
  assert.deepEqual(getCaseSectionImages(roundTrip.sections[0]), images);
  assert.deepEqual(getCaseSectionImages(roundTrip.sections[1]), [content.sections[1].image]);
  assert.deepEqual(roundTrip.sections[1].table, content.sections[1].table);
  assert.deepEqual(roundTrip.video, content.video);
});

test("legacy and new images combine without data loss and share the chapter limit", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  const image = { url: "/images/original.webp", alt: "Original image", caption: "Original caption" };
  const gallery = Array.from({ length: MAX_CASE_SECTION_IMAGES - 1 }, (_, index) => ({ ...image, url: `/images/detail-${index}.webp` }));
  content.sections[0].image = image;
  content.sections[0].images = gallery;
  assert.equal(caseStudyContentSchema.safeParse(content).success, true);
  assert.deepEqual(getCaseSectionImages(content.sections[0]), [image, ...gallery]);
  content.sections[0].images.push(image);
  assert.equal(caseStudyContentSchema.safeParse(content).success, false);
  delete content.sections[0].image;
  assert.equal(caseStudyContentSchema.safeParse(content).success, true);
  content.sections[0].images.push(image);
  assert.equal(caseStudyContentSchema.safeParse(content).success, false);
});

test("every gallery image is validated and removing legacy images does not resurrect them", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  const image = { url: "/images/original.webp", alt: "Original image", caption: "" };
  for (const invalid of [{ ...image, alt: "" }, { ...image, url: "javascript:alert(1)" }, { ...image, caption: "x".repeat(501) }]) {
    content.sections[0].images = [image, invalid];
    assert.equal(caseStudyContentSchema.safeParse(content).success, false);
  }
  content.sections[0] = { ...content.sections[0], image: undefined, images: [] };
  const roundTrip = caseStudyContentSchema.parse(JSON.parse(JSON.stringify(content)));
  assert.deepEqual(getCaseSectionImages(roundTrip.sections[0]), []);
  assert.equal(roundTrip.sections[0].image, undefined);
});

test("imported image/gallery chapters preserve 54 images and the chapter video through repeated saves", () => {
  const imageFor = (index: number) => ({ url: `/images/imported-${index}.webp`, alt: `Imported image ${index}`, caption: `Original caption ${index}` });
  const galleryCounts = [0, 0, 0, 0, 0, 3, 5, 7, 8, 9, 5, 0, 0, 1, 0, 0];
  let imageIndex = 0;
  const sections = galleryCounts.map((count, index) => ({
    id: `stage-${index + 1}`, title: `Original chapter ${index + 1}`, navLabel: `Stage ${index + 1}`,
    paragraphs: [`Original paragraph ${index + 1}`],
    image: imageFor(++imageIndex),
    ...(count ? { gallery: Array.from({ length: count }, () => imageFor(++imageIndex)) } : {}),
    ...(index === 7 ? { video: { url: "/videos/factory-trial-assembly.mp4", poster: "/images/original-poster.webp", caption: "Original factory video caption" } } : {}),
  }));
  const stageMap = {
    id: "stage-map", title: "Stage map", navLabel: "Stage map", paragraphs: ["Original summary paragraph"],
    table: { caption: "Original stage map", headings: ["Stage", "Checkpoint"], rows: [["Factory", "Trial assembly"]] },
  };
  const original = { ...exampleContent, sections: [...sections, stageMap] };
  const expectedImages = sections.flatMap(getCaseSectionImages);
  assert.equal(expectedImages.length, 54);
  let parsed = caseStudyContentSchema.parse(original);
  assert.equal(parsed.sections.length, 17);
  assert.deepEqual(parsed.sections[7].video, { ...sections[7].video, title: sections[7].title });
  for (let save = 0; save < 3; save++) {
    const roundTrip = caseStudyContentSchema.parse(JSON.parse(JSON.stringify(parsed)));
    assert.deepEqual(roundTrip, parsed);
    assert.deepEqual(roundTrip.sections.flatMap(getCaseSectionImages), expectedImages);
    assert.deepEqual(roundTrip.sections[16].table, stageMap.table);
    for (let index = 0; index < sections.length; index++) {
      assert.deepEqual(roundTrip.sections[index].gallery, sections[index].gallery);
      assert.deepEqual(roundTrip.sections[index].paragraphs, sections[index].paragraphs);
    }
    parsed = roundTrip;
  }
});

test("image, images and imported gallery combine in order and share a single capacity limit", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  const original = { url: "/images/original.webp", alt: "Original image", caption: "Original caption" };
  const images = Array.from({ length: 49 }, (_, index) => ({ ...original, url: `/images/selected-${index}.webp` }));
  const gallery = Array.from({ length: 50 }, (_, index) => ({ ...original, url: `/images/imported-${index}.webp` }));
  content.sections[0] = { ...content.sections[0], image: original, images, gallery };
  const parsed = caseStudyContentSchema.parse(content);
  assert.equal(getCaseSectionImages(parsed.sections[0]).length, MAX_CASE_SECTION_IMAGES);
  assert.deepEqual(getCaseSectionImages(parsed.sections[0]), [original, ...images, ...gallery]);
  content.sections[0].gallery!.push(original);
  assert.equal(caseStudyContentSchema.safeParse(content).success, false);
  delete content.sections[0].image;
  assert.equal(caseStudyContentSchema.safeParse(content).success, true);
  content.sections[0].images = [];
  content.sections[0].gallery = [{ ...original, alt: "" }];
  assert.equal(caseStudyContentSchema.safeParse(content).success, false);
});

test("chapter video titles default only when absent and root video remains independent", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  const rootVideo = { url: "/videos/project.mp4", title: "Project film", caption: "Original project caption" };
  const sectionVideo = { url: "/videos/chapter.webm", caption: "Original chapter caption" };
  const input = { ...content, video: rootVideo, sections: [{ ...content.sections[0], video: sectionVideo }] };
  const parsed = caseStudyContentSchema.parse(input);
  assert.equal(parsed.sections[0].video?.title, content.sections[0].title);
  assert.deepEqual(parsed.video, rootVideo);
  const explicit = caseStudyContentSchema.parse({ ...input, sections: [{ ...input.sections[0], video: { ...sectionVideo, title: "Specific video title" } }] });
  assert.equal(explicit.sections[0].video?.title, "Specific video title");
  for (const title of ["", " ", null]) {
    assert.equal(caseStudyContentSchema.safeParse({ ...input, sections: [{ ...input.sections[0], video: { ...sectionVideo, title } }] }).success, false);
  }
  assert.equal(caseStudyContentSchema.safeParse({ ...input, video: sectionVideo }).success, false);
});

test("unsupported media fields fail validation instead of being silently removed", () => {
  const content = caseStudyContentSchema.parse(exampleContent);
  const image = { url: "/images/original.webp", alt: "Original image", caption: "Original caption" };
  const video = { url: "/videos/project.mp4", title: "Original title", caption: "Original caption" };
  for (const unsupported of [
    { ...content, gallery: [image] },
    { ...content, videos: [video] },
    { ...content, sections: [{ ...content.sections[0], photos: [image] }] },
    { ...content, sections: [{ ...content.sections[0], videos: [video] }] },
    { ...content, sections: [{ ...content.sections[0], gallery: [{ ...image, source: "/images/retained.webp" }] }] },
    { ...content, sections: [{ ...content.sections[0], video: { ...video, subtitles: "/videos/original.vtt" } }] },
    { ...content, video: { ...video, subtitles: "/videos/original.vtt" } },
  ]) {
    const result = caseStudyContentSchema.safeParse(unsupported);
    assert.equal(result.success, false);
    assert.ok(result.error?.issues.some(issue => issue.code === "unrecognized_keys"));
  }
});
