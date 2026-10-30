"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./hero-carousel.module.css";

export type HeroPhoto = {
  src: string;
  alt: string;
  category: string;
  caption: string;
  position?: string;
};

function subscribeMotion(listener: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", listener);
  return () => preference.removeEventListener("change", listener);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroCarousel({ photos, className, photoClassName }: {
  photos: readonly HeroPhoto[];
  className?: string;
  photoClassName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const moving = useRef(false);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => true);
  const [position, setPosition] = useState({ index: 1, animate: false });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const count = photos.length;
  const normalize = (index: number) => ((index - 1 + count) % count) + 1;
  const active = normalize(position.index) - 1;
  const playing = !paused && !reducedMotion;
  const slides = count ? [photos[count - 1], ...photos, photos[0]] : [];

  function goTo(index: number, instant = false) {
    if (moving.current || count < 2) return;
    const animate = !instant && !reducedMotion;
    moving.current = animate;
    setPosition({ index: animate ? index : normalize(index), animate });
  }

  function finishMove() {
    setPosition(current => ({ index: ((current.index - 1 + count) % count) + 1, animate: false }));
  }

  useEffect(() => {
    if (position.animate) {
      // Recover if a resize or background tab cancels transitionend.
      const timeout = window.setTimeout(() => {
        setPosition(current => ({ index: ((current.index - 1 + count) % count) + 1, animate: false }));
      }, 650);
      return () => window.clearTimeout(timeout);
    }
    let secondFrame = 0;
    const frame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => { moving.current = false; });
    });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(secondFrame); };
  }, [position, count]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      setInView(entries.some(entry => entry.isIntersecting));
    }, { threshold: 0.25 });
    observer.observe(element);
    const updateVisibility = () => setVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);

  useEffect(() => {
    if (!playing || hovered || !inView || !visible || count < 2) return;
    const timer = window.setTimeout(() => {
      moving.current = true;
      setPosition({ index: active + 2, animate: true });
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [playing, hovered, inView, visible, active, count]);

  if (!count) return null;
  const photo = photos[active];

  return (
    <div ref={root} className={`${styles.carousel} ${className ?? ""}`} role="region" aria-roledescription="carousel" aria-label="Architectural metalwork photographs"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => { if (event.target !== event.currentTarget.querySelector('[data-play-toggle]')) setPaused(true); }}>
      <figure>
        <div className={`${styles.viewport} ${photoClassName ?? ""}`} id="hero-photographs" tabIndex={0}
          aria-label="Project photographs. Use left and right arrow keys to browse."
          onKeyDown={event => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            setPaused(true);
            goTo(event.key === "Home" ? 1 : event.key === "End" ? count : position.index + (event.key === "ArrowLeft" ? -1 : 1), true);
          }}
          onPointerDown={event => {
            if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
            setPaused(true);
            pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={event => {
            const start = pointer.current;
            pointer.current = null;
            if (!start || start.id !== event.pointerId) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(position.index + (dx < 0 ? 1 : -1));
          }}
          onPointerCancel={() => { pointer.current = null; }}
          onLostPointerCapture={() => { pointer.current = null; }}>
          <div className={styles.track} data-animating={position.animate}
            style={{ transform: `translateX(-${position.index * 100}%)` }}
            onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === "transform") finishMove(); }}>
            {slides.map((item, index) => {
              const clone = index === 0 || index === count + 1;
              return <div className={styles.slide} key={`${item.src}-${index}`} role="group" aria-roledescription="slide"
                aria-label={clone ? undefined : `${index} of ${count}`} aria-hidden={clone || index !== active + 1}>
                <Image src={item.src} alt={clone ? "" : item.alt} fill preload={index === 1}
                  sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 850px) calc(100vw - 64px), (max-width: 1496px) 62vw, 918px"
                  style={{ objectPosition: item.position ?? "50% 50%" }} draggable={false} />
              </div>;
            })}
          </div>
          <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label="Previous hero photograph" aria-controls="hero-photographs"
            onPointerDown={event => event.stopPropagation()} onClick={event => { setPaused(true); goTo(position.index - 1, event.detail === 0); }}><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next hero photograph" aria-controls="hero-photographs"
            onPointerDown={event => event.stopPropagation()} onClick={event => { setPaused(true); goTo(position.index + 1, event.detail === 0); }}><ArrowRight size={20} aria-hidden="true" /></button>
          <div className={styles.controls} onPointerDown={event => event.stopPropagation()}>
            <span className={styles.counter} aria-hidden="true">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
            <div className={styles.dots} role="group" aria-label="Choose a hero photograph">
              {photos.map((item, index) => <button key={item.src} type="button" className={styles.dot} aria-label={`Show photograph ${index + 1}: ${item.caption}`}
                aria-pressed={active === index} aria-controls="hero-photographs" onClick={event => { setPaused(true); goTo(index + 1, event.detail === 0); }} />)}
            </div>
            <button type="button" className={styles.toggle} data-play-toggle aria-label={playing ? "Pause hero slideshow" : "Play hero slideshow"}
              aria-controls="hero-photographs" disabled={reducedMotion || count < 2} onClick={() => setPaused(playing)}>
              {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}<span>{playing ? "Pause" : "Play"}</span>
            </button>
          </div>
        </div>
        <figcaption aria-live={playing ? "off" : "polite"} aria-atomic="true">
          <div><span>{photo.category}</span><p>{photo.caption}</p></div>
          <a href="#project-gallery" aria-label="Explore the project photograph collection"><ArrowUpRight size={22} aria-hidden="true" /></a>
        </figcaption>
      </figure>
    </div>
  );
}
