import { notFound } from "next/navigation";

// The former glassware guides have no equivalent on this architectural metal site.
// Keep the retired URLs as 404s rather than redirecting unrelated content.
export function generateMetadata(): never {
  notFound();
}

export default function RetiredGuidePage(): never {
  notFound();
}
