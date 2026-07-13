/**
 * JS-side design tokens.
 *
 * This file centralizes the values consumed by JavaScript - GSAP timings,
 * easings, breakpoints and z-index.
 *
 * Colours are NOT duplicated here: they live only in `app/theme.css` and are
 * read from CSS variables at runtime by the effects that need them (the theme
 * transition overlay and the fluid cursor). Fonts live in `config/fonts.ts`.
 */

export const theme = {
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
    // ease-out-expo - matches GSAP feel
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  },
} as const;

export type Theme = typeof theme;
