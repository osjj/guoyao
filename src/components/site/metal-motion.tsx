"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function MetalMotion({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const targets = element.querySelectorAll<HTMLElement>("[data-metal-reveal]");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches || !entry.target.animate) return;
        const animation = entry.target.animate([{ opacity: .35, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, easing: "cubic-bezier(.23, 1, .32, 1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: .08 });
    targets.forEach(target => observer.observe(target));
    const stop = () => { animations.forEach(animation => animation.cancel()); animations.clear(); };
    const onPreference = () => { if (preference.matches) stop(); };
    const onKeyboard = (event: KeyboardEvent) => { if (event.key === "Tab") stop(); };
    preference.addEventListener("change", onPreference);
    document.addEventListener("keydown", onKeyboard);
    return () => { observer.disconnect(); stop(); preference.removeEventListener("change", onPreference); document.removeEventListener("keydown", onKeyboard); };
  }, []);
  return <div ref={root} className={className}>{children}</div>;
}
