import { notFound } from "next/navigation";

// This legacy glassware catalog is unrelated to the Guoyao Metal website.
// Return a real missing-page response instead of exposing obsolete catalog data.
export default function ProductsPage() {
  notFound();
}
