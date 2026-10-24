"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { InquiryButton } from "./inquiry-contact";
import styles from "./metal-shell.module.css";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/case-studies", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const readingProgress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (readingProgress.current) readingProgress.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside); };
  }, [open]);

  const active = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header ref={header} className={styles.header} data-home={pathname === "/" ? "true" : undefined}>
      <div className={styles.headerInner}>
        <Logo compact variant={pathname === "/" ? "white" : "blue"} />
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href} className={active(item.href) ? styles.active : ""} aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <InquiryButton className={styles.headerCta}>Discuss a project <ArrowUpRight size={16} aria-hidden="true" /></InquiryButton>
        <button ref={trigger} type="button" className={styles.menuToggle} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      {open && <nav className={styles.mobileNav} id="mobile-navigation" aria-label="Mobile navigation">
        {navigation.map((item, index) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={22} aria-hidden="true" /></Link>)}
        <p>Custom architectural metalwork.<br />For retail and architectural spaces.</p>
      </nav>}
      <div className={styles.readingProgress} aria-hidden="true"><div ref={readingProgress} className={styles.readingProgressFill} /></div>
    </header>
  );
}
