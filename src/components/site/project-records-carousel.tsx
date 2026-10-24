"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Pause, Play } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { projectBrands } from "@/data/project-experience";
import styles from "./project-records-carousel.module.css";

export type ProjectRecord = {
  id: string;
  brand: string;
  place: string;
  location: string;
  period: string;
  scope?: string;
};

function subscribeMotionPreference(listener: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", listener);
  return () => preference.removeEventListener("change", listener);
}

function motionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

function documentVisible() {
  return document.visibilityState === "visible";
}

function scrollStops(element: HTMLOListElement) {
  const maximum = Math.max(0, element.scrollWidth - element.clientWidth);
  return [...new Set(Array.from(element.children, child => Math.min((child as HTMLElement).offsetLeft, maximum)))];
}

function moveTrack(element: HTMLOListElement, direction: number, instant: boolean, wrap = false) {
  const stops = scrollStops(element);
  const next = direction > 0
    ? stops.find(stop => stop > element.scrollLeft + 2)
    : stops.findLast(stop => stop < element.scrollLeft - 2);
  const left = next ?? (wrap ? (direction > 0 ? 0 : stops.at(-1)) : undefined);
  // Returning to the first record should not sweep backwards through the archive.
  if (left !== undefined) element.scrollTo({ left, behavior: instant || next === undefined ? "instant" : "smooth" });
}

export function ProjectRecordsCarousel({ items }: { items: readonly ProjectRecord[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const id = useId();
  const reducedMotion = useSyncExternalStore(subscribeMotionPreference, motionPreference, () => true);
  const visible = useSyncExternalStore(subscribeVisibility, documentVisible, () => false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [range, setRange] = useState({ first: 1, last: 1, atStart: true, atEnd: false });
  const playing = !paused && !reducedMotion;
  const advancing = playing && inView && visible && !focused && items.length > 1;

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(entries => {
      setInView(entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.45));
    }, { threshold: 0.45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const left = element.scrollLeft;
      const right = left + element.clientWidth;
      const cards = Array.from(element.children) as HTMLElement[];
      const first = cards.findIndex(card => card.offsetLeft + card.offsetWidth > left + 2);
      const last = cards.findLastIndex(card => card.offsetLeft < right - 2);
      const next = {
        first: Math.max(1, first + 1),
        last: Math.max(1, last + 1),
        atStart: left <= 2,
        atEnd: element.scrollWidth - right <= 2,
      };
      setRange(current => current.first === next.first && current.last === next.last && current.atStart === next.atStart && current.atEnd === next.atEnd ? current : next);
    };
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [items.length]);

  useEffect(() => {
    if (!advancing) return;
    const advance = () => {
      if (track.current) moveTrack(track.current, 1, false, true);
    };
    let interval: number | undefined;
    // A short first dwell makes arrival visibly start the carousel; subsequent
    // records get a longer reading interval. Leaving the viewport clears both.
    const first = window.setTimeout(() => {
      advance();
      interval = window.setInterval(advance, 4200);
    }, 1600);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [advancing]);

  function navigate(direction: number, instant: boolean) {
    setPaused(true);
    if (track.current) moveTrack(track.current, direction, instant || reducedMotion);
  }

  if (!items.length) return null;

  return (
    <section
      ref={section}
      className={styles.section}
      id="project-records"
      aria-labelledby={`${id}-title`}
      aria-roledescription="carousel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>SELECTED PROJECTS / 2016–2026</p>
            <h2 id={`${id}-title`}>Project archive.</h2>
          </div>
          <p className={styles.intro}>A selection of places and projects from our 2016–2026 portfolio.</p>
        </div>
        <ol
          ref={track}
          className={styles.track}
          id={`${id}-track`}
          tabIndex={0}
          aria-label="Project records. Use the left and right arrow keys to browse, or Home and End."
          onTouchStart={event => {
            const touch = event.touches.length === 1 ? event.touches[0] : null;
            touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
          }}
          onTouchMove={event => {
            const start = touchStart.current;
            const touch = event.touches.length === 1 ? event.touches[0] : null;
            if (!start || !touch) return;
            const dx = Math.abs(touch.clientX - start.x);
            const dy = Math.abs(touch.clientY - start.y);
            if (dx > 12 && dx > dy) {
              setPaused(true);
              touchStart.current = null;
            }
          }}
          onTouchEnd={() => { touchStart.current = null; }}
          onTouchCancel={() => { touchStart.current = null; }}
          onWheel={event => {
            if (event.shiftKey || (Math.abs(event.deltaX) > 2 && Math.abs(event.deltaX) > Math.abs(event.deltaY))) setPaused(true);
          }}
          onKeyDown={event => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            setPaused(true);
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              moveTrack(event.currentTarget, event.key === "ArrowLeft" ? -1 : 1, true);
            } else {
              event.currentTarget.scrollTo({ left: event.key === "Home" ? 0 : event.currentTarget.scrollWidth, behavior: "instant" });
            }
          }}
        >
          {items.map((item, index) => {
            const brand = projectBrands.find(brand => brand.name === item.brand);
            return (
              <li className={styles.card} key={item.id} data-brand={item.brand}>
                <div className={styles.cardTop}>
                  <p className={styles.period}>{item.period}</p>
                  <span className={styles.recordNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className={styles.brandMark}>
                  {brand ? <Image src={brand.src} alt={item.brand} width={brand.width} height={brand.height} unoptimized /> : <span>{item.brand}</span>}
                </div>
                <div className={styles.cardBody}>
                  <h3>{item.place}</h3>
                  <p className={styles.location}><MapPin size={14} aria-hidden="true" />{item.location}</p>
                </div>
                {item.scope && <p className={styles.scope}>{item.scope}</p>}
              </li>
            );
          })}
        </ol>
        <div className={styles.footer}>
          <p className={styles.counter} aria-live={advancing ? "off" : "polite"} aria-atomic="true">
            <span className={styles.srOnly}>Visible project records </span>
            {String(range.first).padStart(2, "0")}{range.last > range.first && <>–{String(range.last).padStart(2, "0")}</>}
            <span className={styles.separator}> / </span>{String(items.length).padStart(2, "0")}
          </p>
          <div className={styles.controls}>
            <button
              ref={toggle}
              type="button"
              className={styles.toggle}
              aria-label={playing ? "Pause automatic project scrolling" : "Play automatic project scrolling"}
              aria-controls={`${id}-track`}
              disabled={reducedMotion || items.length < 2}
              title={reducedMotion ? "Automatic scrolling is off while reduced motion is enabled" : undefined}
              onClick={() => {
                setPaused(playing);
                // Explicit Play may run while this button keeps keyboard focus.
                if (!playing && document.activeElement === toggle.current) setFocused(false);
              }}
            >
              {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              <span>{playing ? "Pause" : "Play"}</span>
            </button>
            <button type="button" className={styles.arrow} aria-label="Previous project records" aria-controls={`${id}-track`} disabled={range.atStart} onClick={event => navigate(-1, event.detail === 0)}><ArrowLeft size={19} aria-hidden="true" /></button>
            <button type="button" className={styles.arrow} aria-label="Next project records" aria-controls={`${id}-track`} disabled={range.atEnd} onClick={event => navigate(1, event.detail === 0)}><ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
