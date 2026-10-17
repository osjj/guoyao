import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const requireModule = createRequire(resolve("package.json"));
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=", "base64");
const options = { prompt: "Editorial glassware photograph", size: "1024x1024", quality: "high", outputFormat: "png" };
const routeSources = new Map<string, string>();

type HarnessOptions = {
  authenticated?: boolean;
  configured?: boolean;
  fetch?: (url: string, init?: RequestInit) => Promise<Response>;
};

// Execute the actual route with only external boundaries stubbed. Credentials,
// authentication, remote fetches and storage never reach live services in these tests.
function loadRoute(route: string, settings: HarnessOptions = {}) {
  let source = routeSources.get(route);
  if (!source) {
    source = ts.transpileModule(readFileSync(resolve(`src/app/api/admin/${route}/route.ts`), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    routeSources.set(route, source);
  }
  const exported = {} as { POST: (request: Request) => Promise<Response> };
  const calls: { url: string; init?: RequestInit }[] = [];
  const uploads: { data: Buffer; key: string }[] = [];
  const logoReads: string[] = [];
  runInNewContext(source, {
    exports: exported,
    require: (name: string) => {
      if (name === "server-only") return {};
      if (name === "next/server") return { NextResponse: Response };
      if (name === "@/lib/admin-auth") return { getCurrentAdmin: async () => settings.authenticated === false ? null : { id: "test-admin" } };
      if (name === "node:fs/promises") return { readFile: async (path: string) => { logoReads.push(path); return png; } };
      if (name === "@/lib/r2") return {
        R2_IMAGE_FORMATS: ["webp", "png", "jpeg"],
        uploadImageToR2: async (input: { data: Buffer; key: string }) => {
          uploads.push(input);
          return { url: `https://images.example.test/${input.key}`, key: input.key, width: 1, height: 1, contentType: "image/webp" };
        },
      };
      return requireModule(name);
    },
    process: {
      cwd: () => process.cwd(),
      env: {
        OPENAI_API_KEY: settings.configured === false ? "" : "test-only-key",
        OPENAI_API_ENDPOINT: "https://ai.example.test",
        NEXT_PUBLIC_SITE_URL: "https://site.example.test",
        R2_PUBLIC_URL: "https://images.example.test",
      },
    },
    fetch: async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      if (!settings.fetch) throw new Error("Unexpected network request in test");
      return settings.fetch(url, init);
    },
    Buffer, Uint8Array, Blob, File, FormData, URL, Request, Response, AbortController, Error, SyntaxError,
    setTimeout, clearTimeout,
    console: { error: () => undefined },
  });
  return { post: exported.POST, calls, uploads, logoReads };
}

function imageRequest(body: Record<string, unknown> = options, headers?: HeadersInit) {
  return new Request("https://site.example.test/api/admin/product-image-ai", {
    method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body),
  });
}

function generatedResponse() {
  return Response.json({ data: [{ b64_json: png.toString("base64") }] });
}

function sourceResponse() {
  return new Response(png, { headers: { "content-type": "image/png" } });
}

test("no reference generates with JSON and never loads a source or logo", async () => {
  const harness = loadRoute("product-image-ai", { fetch: async () => generatedResponse() });
  const result = await harness.post(imageRequest());
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("cache-control"), "no-store");
  const payload = await result.json();
  assert.equal(payload.image.width, 1);
  assert.equal(payload.image.format, "png");
  assert.equal(harness.calls.length, 1);
  assert.equal(harness.calls[0].url, "https://ai.example.test/v1/images/generations");
  const init = harness.calls[0].init!;
  assert.equal(new Headers(init.headers).get("content-type"), "application/json");
  assert.deepEqual(JSON.parse(init.body as string), {
    model: "gpt-image-2", prompt: options.prompt, n: 1, size: options.size, quality: options.quality, output_format: "png",
  });
  assert.equal(init.redirect, "manual");
  assert.deepEqual(harness.logoReads, []);
});

test("existing product sources retain edits with validated source bytes and options", async () => {
  const harness = loadRoute("product-image-ai", { fetch: async (url) => url.endsWith("/edits") ? generatedResponse() : sourceResponse() });
  const result = await harness.post(imageRequest({ ...options, sourceUrl: "https://images.example.test/product.png" }));
  assert.equal(result.status, 200);
  assert.equal(harness.calls.length, 2);
  assert.equal(harness.calls[0].url, "https://images.example.test/product.png");
  assert.equal(harness.calls[0].init?.redirect, "manual");
  assert.equal(harness.calls[0].init?.credentials, "omit");
  assert.equal(harness.calls[1].url, "https://ai.example.test/v1/images/edits");
  const form = harness.calls[1].init?.body as FormData;
  assert.ok(form instanceof FormData);
  assert.equal(new Headers(harness.calls[1].init?.headers).has("content-type"), false);
  const files = form.getAll("image[]") as File[];
  assert.equal(files.length, 1);
  assert.deepEqual(Buffer.from(await files[0].arrayBuffer()), png);
  assert.equal(form.get("prompt"), options.prompt);
  assert.equal(form.get("output_format"), "png");
});

test("source and logo references preserve their order and describe the second image as the logo", async () => {
  const harness = loadRoute("product-image-ai", { fetch: async (url) => url.endsWith("/edits") ? generatedResponse() : sourceResponse() });
  const result = await harness.post(imageRequest({ ...options, sourceUrl: "/cover.png", referenceImage: "glarivo-blue-logo" }));
  assert.equal(result.status, 200);
  const form = harness.calls[1].init?.body as FormData;
  const files = form.getAll("image[]") as File[];
  assert.deepEqual(files.map((file) => file.name), ["product.png", "glarivo-logo-blue.png"]);
  assert.match(String(form.get("prompt")), /second input image.*logo reference/);
  assert.equal(harness.logoReads.length, 1);
});

test("logo-only generation uses edits with one image and correct reference wording", async () => {
  const harness = loadRoute("product-image-ai", { fetch: async () => generatedResponse() });
  const result = await harness.post(imageRequest({ ...options, referenceImage: "glarivo-blue-logo" }));
  assert.equal(result.status, 200);
  assert.equal(harness.calls.length, 1);
  assert.equal(harness.calls[0].url, "https://ai.example.test/v1/images/edits");
  const form = harness.calls[0].init?.body as FormData;
  assert.equal(form.getAll("image[]").length, 1);
  assert.match(String(form.get("prompt")), /The input image.*logo reference/);
  assert.doesNotMatch(String(form.get("prompt")), /first|second|product image/);
});

test("invalid or untrusted source URLs are rejected before any fetch", async () => {
  for (const sourceUrl of ["", null, "https://attacker.test/image.png", "https://images.example.test.attacker.test/image.png", "http://169.254.169.254/", "data:image/png;base64,AA==", "https://user:pass@images.example.test/image.png"]) {
    const harness = loadRoute("product-image-ai");
    const result = await harness.post(imageRequest({ ...options, sourceUrl }));
    assert.equal(result.status, 400, String(sourceUrl));
    assert.equal(harness.calls.length, 0);
  }
});

test("authentication, request limits, JSON and option validation fail before generation", async () => {
  const unauthorized = loadRoute("product-image-ai", { authenticated: false });
  const denied = await unauthorized.post(imageRequest());
  assert.equal(denied.status, 401);
  assert.equal(unauthorized.calls.length, 0);
  const cases: [Request, number][] = [
    [imageRequest(options, { "content-length": String(32 * 1024 + 1) }), 413],
    [imageRequest(options, { "content-type": "text/plain" }), 415],
    [imageRequest({ ...options, prompt: "x".repeat(4001) }), 400],
    [imageRequest({ ...options, size: "9999x9999" }), 400],
    [imageRequest({ ...options, outputFormat: "svg" }), 400],
    [imageRequest({ ...options, extra: true }), 400],
    [new Request("https://site.example.test/api", { method: "POST", body: "broken{", headers: { "content-type": "application/json" } }), 400],
  ];
  for (const [request, status] of cases) {
    const harness = loadRoute("product-image-ai");
    assert.equal((await harness.post(request)).status, status);
    assert.equal(harness.calls.length, 0);
  }
});

test("unconfigured generation does not fetch an optional source", async () => {
  const harness = loadRoute("product-image-ai", { configured: false });
  assert.equal((await harness.post(imageRequest({ ...options, sourceUrl: "/cover.png" }))).status, 503);
  assert.equal(harness.calls.length, 0);
});

test("source redirects, MIME mismatches, size limits and invalid pixels never reach the AI service", async () => {
  const cases: [() => Response, number][] = [
    [() => new Response(null, { status: 302, headers: { location: "https://attacker.test/image.png" } }), 400],
    [() => new Response("<svg/>", { headers: { "content-type": "image/svg+xml" } }), 415],
    [() => new Response(png, { headers: { "content-type": "image/png", "content-length": String(12 * 1024 * 1024 + 1) } }), 413],
    [() => new Response("not an image", { headers: { "content-type": "image/png" } }), 415],
    [() => new Response(png, { headers: { "content-type": "image/jpeg" } }), 415],
  ];
  for (const [response, status] of cases) {
    const harness = loadRoute("product-image-ai", { fetch: async () => response() });
    assert.equal((await harness.post(imageRequest({ ...options, sourceUrl: "/cover.png" }))).status, status);
    assert.equal(harness.calls.length, 1);
  }
});

test("upstream failures are sanitized and invalid generated bytes are rejected", async () => {
  for (const [upstream, expected] of [[429, 429], [400, 400], [503, 502], [401, 502]]) {
    const harness = loadRoute("product-image-ai", { fetch: async () => Response.json({ error: "provider-secret-internal-detail" }, { status: upstream }) });
    const result = await harness.post(imageRequest());
    assert.equal(result.status, expected);
    assert.doesNotMatch(await result.text(), /provider-secret|test-only-key/);
  }
  for (const response of [{}, { data: [{ b64_json: "invalid-base64" }] }, { data: [{ b64_json: Buffer.from("not an image").toString("base64") }] }]) {
    const harness = loadRoute("product-image-ai", { fetch: async () => Response.json(response) });
    assert.equal((await harness.post(imageRequest())).status, 502);
  }
});

test("client cancellation is forwarded to generation and returns a bounded error", async () => {
  const controller = new AbortController();
  controller.abort();
  const harness = loadRoute("product-image-ai", { fetch: async (_url, init) => {
    assert.equal(init?.signal?.aborted, true);
    throw new DOMException("Aborted", "AbortError");
  } });
  const request = new Request(imageRequest(), { signal: controller.signal });
  assert.equal((await harness.post(request)).status, 499);
});

function uploadRequest(bytes: number, aiGenerated = false, format = "png") {
  const form = new FormData();
  form.set("image", new File([new Uint8Array(bytes)], "generated.png", { type: "image/png" }));
  form.set("slug", "article-or-case");
  if (aiGenerated) {
    form.set("aiGenerated", "true");
    form.set("outputFormat", format);
  }
  const request = new Request("https://site.example.test/api/admin/images", { method: "POST" });
  request.formData = async () => form;
  return request;
}

for (const [route, prefix] of [["blog-images", "blog"], ["case-study-images", "case-studies"]]) {
  test(`${route}: generated images may exceed the normal source limit and keep their storage prefix`, async () => {
    const harness = loadRoute(route);
    const source = await harness.post(uploadRequest(13 * 1024 * 1024));
    assert.equal(source.status, 413);
    assert.equal(harness.uploads.length, 0);
    const generated = await harness.post(uploadRequest(13 * 1024 * 1024, true));
    assert.equal(generated.status, 200);
    assert.equal(harness.uploads.length, 1);
    assert.ok(harness.uploads[0].key.startsWith(`${prefix}/article-or-case/`));
    assert.ok(harness.uploads[0].key.endsWith(".webp"));
  });

  test(`${route}: authorization, output formats and AI upload limits reject without storage writes`, async () => {
    const unauthorized = loadRoute(route, { authenticated: false });
    assert.equal((await unauthorized.post(uploadRequest(1, true))).status, 401);
    assert.equal(unauthorized.uploads.length, 0);
    const harness = loadRoute(route);
    assert.equal((await harness.post(uploadRequest(1, true, "svg"))).status, 400);
    assert.equal((await harness.post(uploadRequest(25 * 1024 * 1024 + 1, true))).status, 413);
    const oversized = new Request("https://site.example.test/upload", { method: "POST", body: "unread", headers: { "content-length": String(26 * 1024 * 1024 + 1) } });
    assert.equal((await harness.post(oversized)).status, 413);
    assert.equal(oversized.bodyUsed, false);
    assert.equal(harness.uploads.length, 0);
  });
}
