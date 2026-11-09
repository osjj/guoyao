"use client";

import { useCallback, useEffect, useRef } from "react";

// Keep native dialog focus trapping and scroll locking throughout the exit.
export function useDialogMotion(animateOpen: boolean, onClose: () => void) {
  const dialog = useRef<HTMLDialogElement>(null);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const complete = useRef(onClose);

  useEffect(() => { complete.current = onClose; }, [onClose]);

  const close = useCallback((animate = true) => {
    const element = dialog.current;
    if (!element) return;
    if (closing.current) {
      if (!animate) {
        if (animation.current) animation.current.onfinish = null;
        animation.current?.cancel();
        complete.current();
      }
      return;
    }
    closing.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reduced || !element.animate) {
      complete.current();
      return;
    }
    const style = getComputedStyle(element);
    const from = { opacity: style.opacity, transform: style.transform };
    animation.current?.cancel();
    element.dataset.motionDialog = "true";
    element.dataset.closing = "true";
    const exit = element.animate([from, { opacity: 0, transform: "scale(.97)" }], {
      duration: 180,
      easing: style.getPropertyValue("--ease-out").trim() || "cubic-bezier(.23, 1, .32, 1)",
      fill: "forwards",
    });
    animation.current = exit;
    exit.onfinish = () => complete.current();
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    closing.current = false;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    element.dataset.motionDialog = String(animateOpen && !preference.matches);
    element.showModal();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (animateOpen && !preference.matches && element.animate) {
      animation.current = element.animate([
        { opacity: 0, transform: "scale(.97)" },
        { opacity: 1, transform: "scale(1)" },
      ], { duration: 250, easing: getComputedStyle(element).getPropertyValue("--ease-out").trim() || "cubic-bezier(.23, 1, .32, 1)" });
    }
    const stopMotion = () => {
      element.dataset.motionDialog = "false";
      if (closing.current) animation.current?.finish();
      else animation.current?.cancel();
    };
    const onPreference = () => { if (preference.matches) stopMotion(); };
    const onKeyboard = (event: KeyboardEvent) => { if (event.key === "Tab") stopMotion(); };
    preference.addEventListener("change", onPreference);
    document.addEventListener("keydown", onKeyboard);
    return () => {
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("keydown", onKeyboard);
      if (animation.current) animation.current.onfinish = null;
      animation.current?.cancel();
      element.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [animateOpen]);

  return { dialog, close };
}
