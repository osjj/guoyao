import assert from "node:assert/strict";
import test from "node:test";
import {
  CaseVideoUploadError,
  hasCaseVideoSignature,
  MAX_CASE_VIDEO_BYTES,
  MAX_CASE_VIDEO_REQUEST_BYTES,
  readCaseVideoFormData,
  validateCaseVideoFile,
} from "../src/lib/case-study-video-upload";
import { uploadVideoToR2 } from "../src/lib/r2";

function mp4Header(brand = "isom") {
  const data = Buffer.alloc(24);
  data.writeUInt32BE(24);
  data.write("ftyp", 4);
  data.write(brand, 8);
  data.write(brand, 16);
  data.write(brand, 20);
  return data;
}

function webmHeader(documentType = "webm") {
  const type = Buffer.from(documentType);
  return Buffer.concat([
    Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x80 | (3 + type.length), 0x42, 0x82, 0x80 | type.length]),
    type,
  ]);
}

test("video uploads enforce nonempty files, a 50 MB limit and matching extension/MIME", () => {
  assert.equal(validateCaseVideoFile({ name: "site-tour.MP4", type: "video/mp4", size: MAX_CASE_VIDEO_BYTES }), undefined);
  assert.equal(validateCaseVideoFile({ name: "site-tour.webm", type: "", size: 100 }), undefined);
  assert.equal(validateCaseVideoFile({ name: "site-tour.mp4", type: "application/octet-stream", size: 100 }), undefined);
  assert.match(validateCaseVideoFile({ name: "empty.mp4", type: "video/mp4", size: 0 })!, /Select/);
  assert.match(validateCaseVideoFile({ name: "large.mp4", type: "video/mp4", size: MAX_CASE_VIDEO_BYTES + 1 })!, /50 MB/);
  assert.match(validateCaseVideoFile({ name: "photo.png", type: "video/mp4", size: 100 })!, /Only MP4 and WebM/);
  assert.match(validateCaseVideoFile({ name: "mp4", type: "video/mp4", size: 100 })!, /Only MP4 and WebM/);
  assert.match(validateCaseVideoFile({ name: "site-tour.mp4", type: "video/webm", size: 100 })!, /does not match/);
  assert.match(validateCaseVideoFile({ name: "script.mp4", type: "text/html", size: 100 })!, /does not match/);
});

test("container detection rejects forged MIME/extensions, AVIF and Matroska", () => {
  assert.equal(hasCaseVideoSignature(mp4Header(), "mp4"), true);
  assert.equal(hasCaseVideoSignature(webmHeader(), "webm"), true);
  assert.equal(hasCaseVideoSignature(Buffer.from("<html>not a video</html>"), "mp4"), false);
  assert.equal(hasCaseVideoSignature(mp4Header("avif"), "mp4"), false);
  assert.equal(hasCaseVideoSignature(webmHeader("matroska"), "webm"), false);
  assert.equal(hasCaseVideoSignature(mp4Header(), "webm"), false);
  assert.equal(hasCaseVideoSignature(webmHeader(), "mp4"), false);
  assert.equal(hasCaseVideoSignature(mp4Header().subarray(0, 15), "mp4"), false);
  assert.equal(hasCaseVideoSignature(webmHeader().subarray(0, 9), "webm"), false);
});

test("multipart upload parsing preserves the original video bytes", async () => {
  const data = Buffer.concat([mp4Header(), Buffer.from("unaltered video payload")]);
  const body = new FormData();
  body.set("slug", "hotel-lobby");
  body.set("video", new File([data], "site-tour.mp4", { type: "video/mp4" }));
  const form = await readCaseVideoFormData(new Request("https://example.test/upload", { method: "POST", body }));
  assert.equal(form.get("slug"), "hotel-lobby");
  const video = form.get("video") as File;
  assert.equal(video.name, "site-tour.mp4");
  assert.deepEqual(Buffer.from(await video.arrayBuffer()), data);
});

test("multipart parser rejects unsupported or malformed data with actionable client errors", async () => {
  await assert.rejects(
    readCaseVideoFormData(new Request("https://example.test/upload", { method: "POST", body: "{}", headers: { "content-type": "application/json" } })),
    (error: unknown) => error instanceof CaseVideoUploadError && error.status === 415,
  );
  await assert.rejects(
    readCaseVideoFormData(new Request("https://example.test/upload", { method: "POST", body: "bad multipart", headers: { "content-type": "multipart/form-data; boundary=missing" } })),
    (error: unknown) => error instanceof CaseVideoUploadError && error.status === 400,
  );
});

test("declared oversized requests are rejected before reading the body", async () => {
  const request = new Request("https://example.test/upload", {
    method: "POST",
    body: "unread",
    headers: {
      "content-type": "multipart/form-data; boundary=video",
      "content-length": String(MAX_CASE_VIDEO_REQUEST_BYTES + 1),
    },
  });
  await assert.rejects(readCaseVideoFormData(request), (error: unknown) => error instanceof CaseVideoUploadError && error.status === 413);
  assert.equal(request.bodyUsed, false);
});

test("streamed oversized requests are rejected even without a Content-Length header", async () => {
  const chunk = new Uint8Array(1024 * 1024);
  let chunks = 0;
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      chunks += 1;
      controller.enqueue(chunk);
      if (chunks === 60) controller.close();
    },
    cancel() { cancelled = true; },
  });
  const request = new Request("https://example.test/upload", {
    method: "POST",
    body,
    headers: { "content-type": "multipart/form-data; boundary=video" },
    duplex: "half",
  } as RequestInit);
  await assert.rejects(readCaseVideoFormData(request), (error: unknown) => error instanceof CaseVideoUploadError && error.status === 413);
  assert.ok(chunks < 60);
  assert.equal(cancelled, true);
});

test("R2 video helper rejects invalid content and unsafe keys before touching storage", async () => {
  await assert.rejects(uploadVideoToR2({ data: Buffer.from("not video"), key: "case-studies/lobby/videos/sample.mp4", format: "mp4" }), /container format/);
  await assert.rejects(uploadVideoToR2({ data: mp4Header(), key: "case-studies/..\/videos/sample.mp4", format: "mp4" }), /safe case study path/);
  await assert.rejects(uploadVideoToR2({ data: mp4Header(), key: "case-studies/lobby/videos/sample.webm", format: "mp4" }), /safe case study path/);
});
