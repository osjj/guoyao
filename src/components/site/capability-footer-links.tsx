import Link from "next/link";
import { CAPABILITIES_PATH, CAPABILITY_LINKS } from "@/data/capabilities";

export function CapabilityFooterLinks({ className }: { className: string }) {
  return (
    <nav className={className} aria-label="Fabrication capabilities">
      <Link href={CAPABILITIES_PATH}>Capabilities</Link>
      {CAPABILITY_LINKS.map(({ href, label }) => (
        <Link key={href} href={href}>{label}</Link>
      ))}
    </nav>
  );
}
