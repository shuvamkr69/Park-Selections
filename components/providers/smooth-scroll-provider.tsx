"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { theme } from "@/config/theme";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

/**
 * Wires Lenis smooth scrolling into GSAP's ticker and keeps ScrollTrigger in
 * sync. Disabled entirely when the user prefers reduced motion.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: theme.lenis.duration,
      easing: theme.lenis.easing,
      wheelMultiplier: theme.lenis.wheelMultiplier,
      touchMultiplier: theme.lenis.touchMultiplier,
      smoothWheel: true,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Reset scroll position on route change and refresh triggers.
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
