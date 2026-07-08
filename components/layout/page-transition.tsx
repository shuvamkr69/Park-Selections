"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { theme } from "@/config/theme";

/** Subtle fade-up of page content on each route change. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: theme.durations.fast,
          ease: theme.ease.smooth,
        },
      );
    }, el);
    return () => ctx.revert();
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
