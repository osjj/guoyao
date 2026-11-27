"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PRIMARY_NAVIGATION } from "@/lib/site-identity";
import { HeaderContactBar, InquiryButton } from "./inquiry-contact";
import mirror from "./home-styles/style-10-liquid.module.css";
import alloyStyles from "./home-styles/style-13-folded-alloy.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/about") return null;
  return <AlloyInnerHeader />;
}

function AlloyInnerHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const distance = doc.scrollHeight - doc.clientHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
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
    if (!menuOpen) return;

    const desktop = window.matchMedia("(width > 960px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    const dialogIsOpen = () => document.querySelector("dialog[open]") !== null;
    const closeOnOutsidePress = (event: globalThis.PointerEvent) => {
      if (dialogIsOpen()) return;
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || dialogIsOpen()) return;
      if (headerRef.current?.contains(document.activeElement)) {
        menuButtonRef.current?.focus();
      }
      setMenuOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div
        ref={progressRef}
        className={mirror.scrollTrack}
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />
      <header
        ref={headerRef}
        className={`${mirror.header} ${alloyStyles.navigationHeader}`}
        style={{
          position: "fixed",
          inset: "0 0 auto",
          zIndex: 55,
          paddingTop: "env(safe-area-inset-top, 0px)",
          background: "rgba(5, 6, 8, 0.88)",
        }}
      >
        <div className={mirror.headerInner}>
          <Link
            href="/"
            className={mirror.brand}
            aria-label="Guoyao Metal, home"
            onClick={() => setMenuOpen(false)}
          >
            <span className={mirror.brandOrb} aria-hidden="true" />
            <span>GUOYAO</span>
            <span className={mirror.brandSub}>METAL</span>
          </Link>

          <nav className={`${mirror.nav} ${alloyStyles.primaryNav}`} aria-label="Primary navigation">
            {PRIMARY_NAVIGATION.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className={mirror.headerRight}>
            <HeaderContactBar />
            <InquiryButton className={`${mirror.moltenCta} ${alloyStyles.desktopInquiry}`}>
              Start a Project <ArrowUpRight size={15} aria-hidden="true" />
            </InquiryButton>
            <button
              type="button"
              ref={menuButtonRef}
              className={`${mirror.menuBtn} ${alloyStyles.menuToggle}`}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="site-mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              Menu
            </button>
          </div>
        </div>

        <nav
          id="site-mobile-nav"
          className={`${mirror.mobileNav} ${alloyStyles.mobileMenu}`}
          hidden={!menuOpen}
          aria-label="Mobile navigation"
        >
          {PRIMARY_NAVIGATION.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => {
                if (isActive(href)) menuButtonRef.current?.focus();
                setMenuOpen(false);
              }}
            >
              {label}
            </Link>
          ))}
          <InquiryButton className={mirror.moltenCta}>
            Start a Project <ArrowUpRight size={15} aria-hidden="true" />
          </InquiryButton>
        </nav>
      </header>
    </>
  );
}
