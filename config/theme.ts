/**
 * JS-side design tokens.
 *
 * Colour, font-family, radius and shadow scales live in `app/globals.css`
 * under Tailwind v4's `@theme` block (the CSS source of truth). This file
 * centralizes the values consumed by JavaScript — primarily GSAP timings,
 * easings, breakpoints and z-index — so motion and layout logic can be tuned
 * globally from one place.
 */

export const theme = {
  /** Light-mode palette (hex values are authoritative in globals.css). */
  colors: {
    background: "#faf8f3",
    foreground: "#1c1b18",
    primary: "#123024",
    accent: "#b8935a",
    muted: "#e7e1d5",
  },

  /** Dark-mode palette mirror — used by the JS-side theme transition overlay. */
  darkColors: {
    background: "#0f0d0b",
    foreground: "#f0ead8",
    primary: "#1e4d3a",
    accent: "#c9a46a",
    muted: "#252118",
  },

  fonts: {
    sans: "var(--font-sans)",
    serif: "var(--font-serif)",
  },

  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },

  container: {
    maxWidth: 1280,
    padding: 24,
  },

  zIndex: {
    base: 0,
    raised: 10,
    sticky: 20,
    header: 40,
    overlay: 50,
    modal: 60,
    preloader: 90,
    cursor: 100,
  },

  /** Animation durations in seconds (GSAP). */
  durations: {
    fastest: 0.3,
    fast: 0.5,
    base: 0.8,
    slow: 1.1,
    slowest: 1.6,
    preloader: 2.2,
  },

  /** Stagger amounts in seconds. */
  stagger: {
    tight: 0.06,
    base: 0.1,
    loose: 0.16,
  },

  /** Named GSAP easing curves. */
  ease: {
    smooth: "power3.out",
    smoothInOut: "power3.inOut",
    expo: "expo.out",
    soft: "power2.out",
    reveal: "power4.out",
  },

  /** Lenis smooth-scroll configuration. */
  lenis: {
    duration: 1.15,
    // ease-out-expo — matches GSAP feel
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  },
} as const;

export type Theme = typeof theme;
