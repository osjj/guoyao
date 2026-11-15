# Inquiry Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Measure persisted project inquiries and distinguish sales contact clicks.

**Architecture:** A small, testable analytics dispatcher emits fixed events and deduplicates successful submission IDs. The existing inquiry provider supplies the saved-inquiry acknowledgement and a single delegated contact listener. GA4 receives the existing Guoyao stream only.

**Tech Stack:** Next.js 16, React 19, TypeScript, node:test / tsx, existing gtag.

**Spec:** docs/superpowers/specs/2026-11-15-inquiry-analytics-design.md

## Global Constraints

- User deploys manually; do not deploy or push.
- No real production inquiry submissions or messages for testing.
- Preserve existing homepage hero/image changes.
- Do not change inquiry persistence, notifications or database schema.
- Only `generate_lead` is marked as a key event; contact clicks stay separate.
- Custom parameters contain no customer data, UUIDs, contact URLs or query strings.

## Review Focus

- A saved inquiry followed by a lost response must count once after a successful retry.
- Analytics unavailable or throwing must not turn success into a form error.
- Rejected or malformed acknowledgements must not count a lead.
- Delegated contact tracking must not duplicate or treat picker opening as a contact.
- Local QA must not send real analytics, save real inquiries or send notification mail.

### Task 1: Dispatcher and provider integration

**Files:** Create src/lib/inquiry-analytics.ts and src/lib/inquiry-analytics.test.ts; modify src/components/site/inquiry-contact.tsx.

**Interfaces:** `createInquiryAnalytics(send)` returns `trackSavedInquiry({ responseOk, result, submissionId, sourcePath })` and `trackContactClick({ href, sourcePath, location })`; methods return whether an event was queued. The production singleton uses the existing Guoyao GA4 stream.

- [x] Write tests for success, same-ID deduplication, different IDs, failed-then-successful retry, HTTP/body rejection, sender failure/recovery, contact allowlisting and parameter privacy.
- [x] Run the tests and observe the missing implementation failure.
- [x] Implement the dispatcher and production transport, then integrate the success callback and delegated contact click/auxclick listener with cleanup.
- [x] Run analytics and inquiry tests, TypeScript and scoped ESLint.
- [x] Build locally and verify intercepted success/failure and contact events in the browser.
- [x] Obtain an independent diff review and address findings.

### Task 2: GA4 registration and handoff

**Files:** Update docs/inquiries.md with event semantics and manual release checks.

- [x] In the existing GA4 property, inspect events before mutation; create the code-based generate_lead key event only if absent, once per event, no default value.
- [x] Verify the saved event and counting method; do not simulate production events.
- [x] Record the local validation and GA4 state, then remind the user to deploy manually and distinguish it from production receipt verification.

## Verification record

2026-11-15: 16 inquiry/analytics tests, TypeScript, scoped ESLint, production webpack build and whitespace checks passed. Independent review found an early dataLayer Array/Arguments compatibility issue; a regression test failed first, the transport was corrected, and both the unit test and an intercepted real Google tag test passed with the event queued before config.

Local production browser QA intercepted all inquiry submissions and analytics requests. A lost-response simulation and successful retry used the same UUID and emitted one generate_lead; HTTP503 emitted none; an analytics exception preserved the successful UI. Rail, footer keyboard activation, modal and both WhatsApp destinations emitted separate intent events. No real inquiry record or notification email was created.

Full suite: 98/100 pass. Existing tests `reference images must come from public site or configured media` and `optimization sends selected photos with text and accepts a text-only section` still assume the Glarivo image origin in tests/product-copy.test.ts. Those tests and product-copy/site-url production sources are unchanged by this work.

GA4 property560660345: generate_lead persisted as a key event, Once per event, no default monetary value; purchase preserved. Code remains local and uncommitted. Deployment and production event receipt remain pending the user's manual deployment.
