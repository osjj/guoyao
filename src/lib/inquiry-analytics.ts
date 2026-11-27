import { CAPABILITIES_PATH, CAPABILITY_LINKS } from "@/data/capabilities";
import { DEFAULT_SITE_URL, SALES_EMAIL, SALES_WHATSAPP_CONTACTS } from "./site-identity";

export type InquiryAnalyticsEvent = "generate_lead" | "contact_email" | "contact_whatsapp";
export type InquiryAnalyticsParameters = Record<string, string>;
type AnalyticsSender = (name: InquiryAnalyticsEvent, parameters: InquiryAnalyticsParameters) => boolean;

const contactLocations = new Set(["floating_rail", "inquiry_form", "footer", "page_content"]);
const whatsappDestinations = new Set(SALES_WHATSAPP_CONTACTS.map(({ href }) => href));

function pageType(path: string): string {
  if (path === "/") return "home";
  if (path === CAPABILITIES_PATH) return "capabilities";
  if (path === "/case-studies") return "projects";
  if (path.startsWith("/case-studies/")) return "project";
  if (path === "/blog") return "blog";
  if (path.startsWith("/blog/")) return "article";
  if (path.startsWith("/products/")) return "product";
  if (path === "/about") return "about";
  return "other";
}

function pageAttribution(sourcePath: string): InquiryAnalyticsParameters {
  const path = sourcePath.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
  const capability = CAPABILITY_LINKS.find(({ href }) => href === path);
  return capability
    ? { page_type: "capability", capability_slug: capability.slug }
    : { page_type: pageType(path) };
}

export function createInquiryAnalytics(send: AnalyticsSender) {
  // The API already deduplicates persisted inquiries using this same UUID.
  // Keep it in page memory only; never send it or any customer fields to GA.
  const countedSubmissions = new Set<string>();

  function emit(name: InquiryAnalyticsEvent, parameters: InquiryAnalyticsParameters): boolean {
    try {
      return send(name, parameters);
    } catch {
      // A blocked or failed analytics provider cannot change the inquiry result.
      return false;
    }
  }

  return {
    trackSavedInquiry({ responseOk, result, submissionId, sourcePath }: {
      responseOk: boolean;
      result: unknown;
      submissionId: string;
      sourcePath: string;
    }): boolean {
      if (!responseOk || !result || typeof result !== "object" || !("success" in result) || result.success !== true) return false;
      if (!submissionId || countedSubmissions.has(submissionId)) return false;
      const queued = emit("generate_lead", { form_id: "project_inquiry", ...pageAttribution(sourcePath) });
      if (queued) countedSubmissions.add(submissionId);
      return queued;
    },

    trackContactClick({ href, sourcePath, location }: { href: string; sourcePath: string; location: string }): boolean {
      let url: URL;
      try {
        url = new URL(href, DEFAULT_SITE_URL);
      } catch {
        return false;
      }
      let name: InquiryAnalyticsEvent;
      if (url.protocol === "mailto:" && url.pathname.toLowerCase() === SALES_EMAIL.toLowerCase()) {
        name = "contact_email";
      } else if (whatsappDestinations.has(`${url.origin}${url.pathname}`)) {
        name = "contact_whatsapp";
      } else {
        return false;
      }
      return emit(name, {
        ...pageAttribution(sourcePath),
        contact_location: contactLocations.has(location) ? location : "page_content",
      });
    },
  };
}

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export const inquiryAnalytics = createInquiryAnalytics((name, parameters) => {
  if (process.env.NODE_ENV !== "production" || typeof window === "undefined") return false;
  const analyticsWindow = window as AnalyticsWindow;
  // Queue early interactions using the same dataLayer as the existing tag.
  // The Google script may still be loading when a visitor contacts sales.
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.gtag ??= function () {
    // Google interprets Arrays as legacy method calls, not gtag commands.
    // eslint-disable-next-line prefer-rest-params -- The vendor protocol requires an Arguments object.
    analyticsWindow.dataLayer!.push(arguments);
  };
  analyticsWindow.gtag("event", name, { ...parameters, send_to: "G-0WRGEBX2MG" });
  return true;
});
