import assert from "node:assert/strict";
import test from "node:test";
import { createInquiryAnalytics, inquiryAnalytics, type InquiryAnalyticsEvent, type InquiryAnalyticsParameters } from "./inquiry-analytics";

function recorder() {
  const events: { name: InquiryAnalyticsEvent; parameters: InquiryAnalyticsParameters }[] = [];
  const analytics = createInquiryAnalytics((name, parameters) => {
    events.push({ name, parameters });
    return true;
  });
  return { analytics, events };
}

const saved = { responseOk: true, result: { success: true }, submissionId: "saved-inquiry-1", sourcePath: "/case-studies/sephora-luxury-retail-fit-out" };

test("counts an acknowledged saved inquiry once, including an idempotent retry", () => {
  const { analytics, events } = recorder();
  assert.equal(analytics.trackSavedInquiry(saved), true);
  assert.equal(analytics.trackSavedInquiry(saved), false);
  assert.equal(events.length, 1);
  assert.deepEqual(events[0], { name: "generate_lead", parameters: { form_id: "project_inquiry", page_type: "project" } });
  assert.equal(analytics.trackSavedInquiry({ ...saved, submissionId: "saved-inquiry-2" }), true);
  assert.equal(events.length, 2);
});

test("does not count rejected acknowledgements and permits a later successful retry", () => {
  const { analytics, events } = recorder();
  for (const input of [
    { ...saved, responseOk: false },
    { ...saved, result: { success: false } },
    { ...saved, result: { success: "true" } },
    { ...saved, result: null },
    { ...saved, result: {} },
  ]) assert.equal(analytics.trackSavedInquiry(input), false);
  assert.equal(events.length, 0);
  assert.equal(analytics.trackSavedInquiry(saved), true);
  assert.equal(events.length, 1);
});

test("isolates sender failures and only deduplicates events that were queued", () => {
  let attempts = 0;
  const analytics = createInquiryAnalytics(() => {
    attempts += 1;
    if (attempts === 1) throw new Error("Analytics unavailable");
    return attempts > 2;
  });
  assert.equal(analytics.trackSavedInquiry(saved), false);
  assert.equal(analytics.trackSavedInquiry(saved), false);
  assert.equal(analytics.trackSavedInquiry(saved), true);
  assert.equal(analytics.trackSavedInquiry(saved), false);
  assert.equal(attempts, 3);
});

test("counts actual configured email and both WhatsApp destinations separately", () => {
  const { analytics, events } = recorder();
  for (const href of ["mailto:sales@guoyaometal.com", "https://wa.me/8618688757773", "https://wa.me/8618825913441"]) {
    assert.equal(analytics.trackContactClick({ href, sourcePath: "/", location: "floating_rail" }), true);
  }
  assert.deepEqual(events.map(({ name }) => name), ["contact_email", "contact_whatsapp", "contact_whatsapp"]);
  assert.deepEqual(events[0].parameters, { page_type: "home", contact_location: "floating_rail" });
});

test("ignores non-sales links and misleading contact hosts", () => {
  const { analytics, events } = recorder();
  for (const href of ["#", "/case-studies", "tel:+8618688757773", "mailto:customer@example.com", "https://wa.me/12345", "https://wa.me.evil.example/8618688757773", "http://wa.me/8618688757773", "javascript:alert(1)"]) {
    assert.equal(analytics.trackContactClick({ href, sourcePath: "/", location: "page_content" }), false);
  }
  assert.deepEqual(events, []);
});

test("emits only fixed categories even when source paths or contact queries contain personal data", () => {
  const { analytics, events } = recorder();
  analytics.trackSavedInquiry({ ...saved, sourcePath: "/blog/customer@example.com?email=private@example.com#name=Buyer", result: { success: true, email: "private@example.com", name: "Buyer", message: "Private inquiry" } });
  analytics.trackContactClick({ href: "mailto:sales@guoyaometal.com?body=Private%20inquiry", sourcePath: "/about?phone=123456", location: "inquiry_form" });
  assert.deepEqual(events, [
    { name: "generate_lead", parameters: { form_id: "project_inquiry", page_type: "article" } },
    { name: "contact_email", parameters: { page_type: "about", contact_location: "inquiry_form" } },
  ]);
  assert.doesNotMatch(JSON.stringify(events), /private|Buyer|123456|saved-inquiry|@|\?/);
});

test("classifies core pages and falls back to a fixed value for unknown paths", () => {
  const { analytics, events } = recorder();
  for (const sourcePath of ["/case-studies", "/blog", "/products/example", "/about", "/unknown/private-value"]) {
    analytics.trackContactClick({ href: "mailto:sales@guoyaometal.com", sourcePath, location: "footer" });
  }
  assert.deepEqual(events.map(({ parameters }) => parameters.page_type), ["projects", "blog", "product", "about", "other"]);
});

test("production transport queues Google Arguments commands before the tag initializes", () => {
  const originalEnvironment = process.env.NODE_ENV;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const browser: { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } = {};
  try {
    Object.assign(process.env, { NODE_ENV: "production" });
    Object.defineProperty(globalThis, "window", { value: browser, configurable: true });
    assert.equal(inquiryAnalytics.trackContactClick({ href: "mailto:sales@guoyaometal.com", sourcePath: "/", location: "footer" }), true);
    assert.equal(browser.dataLayer?.length, 1);
    const command = browser.dataLayer![0] as IArguments;
    // The vendor distinguishes Arguments commands from legacy Array method calls.
    assert.equal(Object.prototype.toString.call(command), "[object Arguments]");
    assert.equal(command[0], "event");
    assert.equal(command[1], "contact_email");
    assert.deepEqual(command[2], { page_type: "home", contact_location: "footer", send_to: "G-0WRGEBX2MG" });
  } finally {
    if (originalEnvironment === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
    else Object.assign(process.env, { NODE_ENV: originalEnvironment });
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("development transport never creates a production analytics queue", () => {
  const originalEnvironment = process.env.NODE_ENV;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const browser: { dataLayer?: unknown[] } = {};
  try {
    Object.assign(process.env, { NODE_ENV: "development" });
    Object.defineProperty(globalThis, "window", { value: browser, configurable: true });
    assert.equal(inquiryAnalytics.trackContactClick({ href: "mailto:sales@guoyaometal.com", sourcePath: "/", location: "footer" }), false);
    assert.equal(browser.dataLayer, undefined);
  } finally {
    if (originalEnvironment === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
    else Object.assign(process.env, { NODE_ENV: originalEnvironment });
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
