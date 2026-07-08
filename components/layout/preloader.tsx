"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/components/providers/smooth-scroll-provider";

/**
 * Custom event dispatched at the start of the preloader outro so hero
 * entrance animations can begin exactly in sync with the overlay fade.
 */
export const PL_DONE_EVENT = "pl:done";

export function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Skip on subsequent visits — preloader only runs once per session.
    const seen = sessionStorage.getItem("ps-preloaded");
    if (seen) {
      setDone(true);
      return;
    }

    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    // Reduced-motion path: instant swap with a short fade.
    if (prefersReducedMotion()) {
      sessionStorage.setItem("ps-preloaded", "1");
      window.dispatchEvent(new CustomEvent(PL_DONE_EVENT));
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          lenis?.start();
          setDone(true);
        },
      });
      tl.to(rootRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
      return () => {
        tl.kill();
        document.documentElement.style.overflow = "";
        lenis?.start();
      };
    }

    const ctx = gsap.context(() => {
      // ── Set all initial (hidden) states before first paint ─────────
      gsap.set("[data-pl=park]", { y: -30, opacity: 0 });
      gsap.set(
        "[data-pl=bar-upper-l], [data-pl=bar-lower-l]",
        { scaleX: 0, transformOrigin: "right center" },
      );
      gsap.set(
        "[data-pl=bar-upper-r], [data-pl=bar-lower-r]",
        { scaleX: 0, transformOrigin: "left center" },
      );
      gsap.set("[data-pl=sel]", { y: "115%" });
      gsap.set("[data-pl=byline]", { y: 14, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("ps-preloaded", "1");
          document.documentElement.style.overflow = "";
          lenis?.start();
          setDone(true);
        },
      });

      // ── 1. Bars draw from centre outward (upper + lower simultaneously) ─
      tl.to(
        "[data-pl=bar-upper-l], [data-pl=bar-upper-r], [data-pl=bar-lower-l], [data-pl=bar-lower-r]",
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        0.2,
      );

      // ── 2. SELECTIONS rises up between the bars via clipping wrapper ──
      tl.to("[data-pl=sel]", {
        y: "0%",
        duration: 0.7,
        ease: "power3.out",
      }, 0.5);

      // ── 3. PARK descends + fades in ────────────────────────────────
      tl.to("[data-pl=park]", {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
      }, 0.65);

      // ── 4. "by ERA HOTELS" rises into view ─────────────────────────
      tl.to("[data-pl=byline]", {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
      }, 1.0);

      // ── 5. Hold: completed logo is fully visible ───────────────────
      tl.to({}, { duration: 0.5 });

      // ── 6. Dispatch pl:done so hero begins its entrance in sync ────
      tl.call(() => {
        window.dispatchEvent(new CustomEvent(PL_DONE_EVENT));
      });

      // ── 7. Logo zooms toward the viewer while fading ───────────────
      tl.to(logoRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 0.65,
        ease: "power2.in",
      });

      // ── 8. Overlay fades to reveal the hero (overlaps logo outro) ──
      tl.to(
        rootRef.current,
        { opacity: 0, duration: 0.55, ease: "power2.out" },
        "-=0.45",
      );
    }, rootRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background"
      aria-hidden="true"
    >
      {/*
       * Logo block. Dimensions are intentionally generous so that at every
       * breakpoint PARK (large serif) sits cleanly above the bars.
       */}
      <div
        ref={logoRef}
        className="flex flex-col items-center"
        style={{ gap: "0.75rem" }}
      >
        {/* ── PARK ────────────────────────────────────────────────── */}
        <div
          data-pl="park"
          className="select-none font-serif font-medium leading-none tracking-[-0.015em] text-foreground"
          style={{ fontSize: "clamp(3.75rem, 11vw, 5.75rem)" }}
        >
          PARK
        </div>

        {/* ── Upper bar — two halves drawing from centre ────────── */}
        <div
          className="relative"
          style={{ height: "1px", width: "clamp(13rem, 38vw, 20rem)" }}
        >
          <div
            data-pl="bar-upper-l"
            className="absolute inset-y-0 left-0 w-1/2 bg-accent"
          />
          <div
            data-pl="bar-upper-r"
            className="absolute inset-y-0 right-0 w-1/2 bg-accent"
          />
        </div>

        {/* ── SELECTIONS — slides up through the overflow-hidden mask ── */}
        <div className="overflow-hidden" style={{ paddingBlock: "0.15em" }}>
          <div
            data-pl="sel"
            className="select-none font-sans font-light text-foreground/80"
            style={{
              fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
              letterSpacing: "0.52em",
            }}
          >
            SELECTIONS
          </div>
        </div>

        {/* ── Lower bar ──────────────────────────────────────────── */}
        <div
          className="relative"
          style={{ height: "1px", width: "clamp(13rem, 38vw, 20rem)" }}
        >
          <div
            data-pl="bar-lower-l"
            className="absolute inset-y-0 left-0 w-1/2 bg-accent"
          />
          <div
            data-pl="bar-lower-r"
            className="absolute inset-y-0 right-0 w-1/2 bg-accent"
          />
        </div>

        {/* ── by ERA HOTELS ─────────────────────────────────────── */}
        <div
          data-pl="byline"
          className="select-none font-sans font-medium text-foreground/40"
          style={{
            fontSize: "clamp(0.55rem, 1.5vw, 0.65rem)",
            letterSpacing: "0.44em",
            marginTop: "0.25rem",
          }}
        >
          by ERA HOTELS
        </div>
      </div>
    </div>
  );
}
