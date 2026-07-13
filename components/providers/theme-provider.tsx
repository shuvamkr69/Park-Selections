"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "ps-theme";

// Read a theme's --background straight from the single CSS source
// (app/theme.css) so the transition overlay can never drift out of sync.
function overlayBg(mode: ThemeMode): string {
  const probe = document.createElement("div");
  probe.setAttribute("data-theme", mode);
  probe.style.display = "none";
  document.documentElement.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue("--background").trim();
  probe.remove();
  return value || (mode === "dark" ? "#0f0d0b" : "#faf8f3");
}

interface ThemeContextValue {
  theme: ThemeMode;
  toggle: (e: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Commit a theme synchronously (no overlay animation). Used by the magicui
   * AnimatedThemeToggler, which supplies its own View-Transition reveal.
   */
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === "light" || s === "dark") return s;
  } catch {}
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function commitTheme(t: ThemeMode) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {}
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  // Ref so the stable `toggle` callback always reads the latest theme.
  const themeRef = useRef<ThemeMode>("light");
  const overlayRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  useEffect(() => {
    const t = readStoredTheme();
    commitTheme(t);
    themeRef.current = t;
    setTheme(t);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    commitTheme(mode);
    themeRef.current = mode;
    setTheme(mode);
  }, []);

  const toggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (animating.current) return;
    animating.current = true;

    const next: ThemeMode = themeRef.current === "light" ? "dark" : "light";
    const nextBg = overlayBg(next);
    const overlay = overlayRef.current;

    // Reduced-motion path: instant swap behind a 250ms fade
    if (!overlay || prefersReducedMotion()) {
      if (overlay) {
        overlay.style.backgroundColor = nextBg;
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "all";
      }
      commitTheme(next);
      setTheme(next);
      themeRef.current = next;
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.inOut",
          onComplete: () => {
            overlay.style.pointerEvents = "none";
            animating.current = false;
          },
        });
      } else {
        animating.current = false;
      }
      return;
    }

    // Premium path: circular clip-path wipe from the button's centre.
    const rect = e.currentTarget.getBoundingClientRect();
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;
    // Radius large enough to reach the farthest viewport corner.
    const maxR =
      Math.hypot(
        Math.max(ox, window.innerWidth - ox),
        Math.max(oy, window.innerHeight - oy),
      ) * 1.05;

    overlay.style.backgroundColor = nextBg;
    overlay.style.clipPath = `circle(0px at ${ox}px ${oy}px)`;
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "all";

    gsap
      .timeline({
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          animating.current = false;
        },
      })
      // Phase 1 - expand circle until it covers the whole viewport.
      .to(overlay, {
        clipPath: `circle(${maxR}px at ${ox}px ${oy}px)`,
        duration: 0.62,
        ease: "power3.inOut",
      })
      // Swap the theme at full coverage - the overlay colour and the new
      // background are the same value so the seam is invisible.
      .call(() => {
        commitTheme(next);
        setTheme(next);
        themeRef.current = next;
      })
      // Phase 2 - fast opacity fade to reveal the re-themed page.
      .to(overlay, {
        opacity: 0,
        duration: 0.18,
        ease: "power2.out",
        onComplete: () => {
          overlay.style.clipPath = "";
        },
      });
  }, []); // stable - reads themeRef, not React state

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: setThemeMode }}>
      {children}
      {/* Transition overlay - sits above cursor (z-100) and preloader (z-90). */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          opacity: 0,
          pointerEvents: "none",
          willChange: "clip-path, opacity",
        }}
      />
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
