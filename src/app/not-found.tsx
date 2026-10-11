import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site/logo";

const destinations = [
  { href: "/", label: "Home" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function NotFoundPage() {
  return <main className="flex min-h-svh flex-col bg-[#f5f2ec] text-[#22231f]" style={{ fontFamily: "var(--font-home-sans), Arial, sans-serif" }}>
    <div className="bg-[#22231f] px-5 py-5 sm:px-12">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
        <Logo variant="white" compact />
        <span className="hidden text-[9px] tracking-[0.18em] text-[#b7a58c] sm:block">404 / PAGE NOT FOUND</span>
      </div>
    </div>
    <div className="mx-auto grid w-[calc(100%_-_40px)] max-w-[1280px] flex-1 items-center gap-12 py-16 sm:w-[calc(100%_-_96px)] sm:py-24 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
      <div>
        <p className="mb-5 text-[10px] tracking-[0.2em] text-[#8c7150]">AN UNEXPECTED TURN / 404</p>
        <h1 className="max-w-[650px] text-[clamp(54px,7vw,104px)] leading-[1.02] font-normal tracking-[-0.045em]" style={{ fontFamily: "var(--font-home-display), Georgia, serif" }}>This page is<br /><em className="font-normal text-[#8c7150]">out of view.</em></h1>
        <p className="mt-7 max-w-[420px] text-sm leading-7 text-[#777367]">We couldn&apos;t find the page at this address. Continue exploring Guoyao Metal through one of the destinations below.</p>
      </div>
      <nav aria-label="Continue exploring" className="border-t border-[#d5cfc4]">
        {destinations.map((destination, index) => <Link key={destination.href} href={destination.href} className="group flex min-h-[78px] items-center gap-5 border-b border-[#d5cfc4] py-5 transition-colors hover:text-[#8c7150] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ae9069]">
          <span className="text-[9px] tracking-[0.1em] text-[#8c7150]">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[30px] leading-tight" style={{ fontFamily: "var(--font-home-display), Georgia, serif" }}>{destination.label}</span>
          <ArrowUpRight className="ml-auto shrink-0 text-[#8c7150]" size={21} aria-hidden="true" />
        </Link>)}
      </nav>
    </div>
    <div className="mx-auto flex w-[calc(100%_-_40px)] max-w-[1280px] flex-wrap justify-between gap-3 border-t border-[#d5cfc4] py-6 text-[8px] tracking-[0.14em] text-[#858074] sm:w-[calc(100%_-_96px)]"><span>GUOYAO METAL</span><span>ARCHITECTURAL METALWORKS</span></div>
  </main>;
}
