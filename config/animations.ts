import type { gsap } from "gsap";
import { theme } from "./theme";

/**
 * Reusable GSAP animation presets.
 *
 * Every animation on the site should be composed from these presets so motion
 * stays consistent and can be retuned globally by editing this file (and the
 * timings in `config/theme.ts`).
 *
 * Each preset returns `{ from, to }` vars usable with `gsap.fromTo`, or a
 * builder for timelines.
 */

const { durations: D, ease: E, stagger: S } = theme;

type Vars = gsap.TweenVars;

export const fadeUp = (distance = 40): { from: Vars; to: Vars } => ({
  from: { opacity: 0, y: distance },
  to: { opacity: 1, y: 0, duration: D.base, ease: E.smooth },
});

export const fadeIn = (): { from: Vars; to: Vars } => ({
  from: { opacity: 0 },
  to: { opacity: 1, duration: D.base, ease: E.soft },
});

export const slideLeft = (distance = 60): { from: Vars; to: Vars } => ({
  from: { opacity: 0, x: distance },
  to: { opacity: 1, x: 0, duration: D.base, ease: E.smooth },
});

export const slideRight = (distance = 60): { from: Vars; to: Vars } => ({
  from: { opacity: 0, x: -distance },
  to: { opacity: 1, x: 0, duration: D.base, ease: E.smooth },
});

export const scaleIn = (): { from: Vars; to: Vars } => ({
  from: { opacity: 0, scale: 0.92 },
  to: { opacity: 1, scale: 1, duration: D.slow, ease: E.expo },
});

/** Stagger reveal for groups of elements (cards, list items). */
export const staggerReveal = (distance = 30): { from: Vars; to: Vars } => ({
  from: { opacity: 0, y: distance },
  to: {
    opacity: 1,
    y: 0,
    duration: D.base,
    ease: E.smooth,
    stagger: S.base,
  },
});

/** Line-by-line text reveal (used with word/line-split spans). */
export const textReveal = (): { from: Vars; to: Vars } => ({
  from: { opacity: 0, y: "110%" },
  to: {
    opacity: 1,
    y: "0%",
    duration: D.slow,
    ease: E.reveal,
    stagger: S.tight,
  },
});

/** Image reveal via clip-path wipe. */
export const imageReveal = (): { from: Vars; to: Vars } => ({
  from: { clipPath: "inset(0 0 100% 0)", scale: 1.15 },
  to: {
    clipPath: "inset(0 0 0% 0)",
    scale: 1,
    duration: D.slowest,
    ease: E.smoothInOut,
  },
});

/** Parallax config for background/foreground layers driven by ScrollTrigger. */
export const parallax = { yPercent: -14 };

/** Standard ScrollTrigger config used across scroll-reveal sections. */
export const scrollReveal = {
  start: "top 82%",
  toggleActions: "play none none none",
} as const;

/** Page transition (route change) timing. */
export const pageTransition = {
  duration: D.fast,
  ease: E.smoothInOut,
};

export const animations = {
  fadeUp,
  fadeIn,
  slideLeft,
  slideRight,
  scaleIn,
  staggerReveal,
  textReveal,
  imageReveal,
  parallax,
  scrollReveal,
  pageTransition,
};
