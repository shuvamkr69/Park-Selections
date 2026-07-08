"use client";

import { useEffect, useRef } from "react";
import { Diamond } from "lucide-react";
import { MARQUEE_ITEMS } from "@/constants/services";
import type { Amenity } from "@/types";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Two infinite marquee strips scrolling in opposite directions. A single rAF
 * loop advances both tracks; the base speed is subtly modulated by the user's
 * vertical scroll velocity. Content is duplicated so the loop wraps with no
 * visible jump.
 */

function Sequence({
  items,
  ariaHidden,
}: {
  items: Amenity[];
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map(({ title, icon: Icon }, i) => (
        <div key={`${title}-${i}`} className="flex items-center">
          <span className="flex items-center gap-3 px-6 md:px-9">
            <Icon className="size-5 text-accent md:size-6" />
            <span className="whitespace-nowrap text-lg font-medium uppercase tracking-[0.14em] text-primary-foreground md:text-2xl">
              {title}
            </span>
          </span>
          <Diamond className="size-2.5 shrink-0 fill-accent text-accent" />
        </div>
      ))}
    </div>
  );
}

function Row({
  direction,
  velocityRef,
}: {
  direction: "left" | "right";
  velocityRef: React.MutableRefObject<number>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = prefersReducedMotion();
    const seq = track.firstElementChild as HTMLElement | null;
    let setWidth = seq?.offsetWidth ?? 0;

    const measure = () => {
      const first = track.firstElementChild as HTMLElement | null;
      setWidth = first?.offsetWidth ?? setWidth;
    };
    const ro = new ResizeObserver(measure);
    if (seq) ro.observe(seq);

    // Right-scrolling row starts offset so content fills from the left edge.
    posRef.current = direction === "right" ? -setWidth : 0;

    const base = 0.4; // px per frame
    let last = performance.now();

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 16.667, 3); // frames elapsed, capped
      last = now;

      if (!setWidth) {
        measure();
        return;
      }

      // Scroll velocity nudges speed; direction sign keeps rows opposed.
      const dir = direction === "left" ? -1 : 1;
      const speed = (base + Math.abs(velocityRef.current) * 0.35) * dir;
      let pos = posRef.current + speed * dt;

      // Wrap seamlessly within one sequence width.
      if (pos <= -setWidth) pos += setWidth;
      else if (pos >= 0) pos -= setWidth;
      posRef.current = pos;

      track.style.transform = `translate3d(${pos}px,0,0)`;
    };

    if (!reduced) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (direction === "right") {
      track.style.transform = `translate3d(${-setWidth}px,0,0)`;
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [direction, velocityRef]);

  return (
    <div className="flex overflow-hidden">
      <div ref={trackRef} className="flex will-change-transform">
        <Sequence items={MARQUEE_ITEMS} />
        <Sequence items={MARQUEE_ITEMS} ariaHidden />
      </div>
    </div>
  );
}

export function ServiceMarquee() {
  const velocityRef = useRef(0);

  // Track vertical scroll velocity, smoothed toward 0 so it eases out.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      // Blend the fresh delta in, decay the rest.
      velocityRef.current = velocityRef.current * 0.85 + delta * 0.15;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      aria-label="Our offerings"
      className="overflow-hidden border-y border-primary-foreground/10 bg-primary py-8 md:py-12"
    >
      <div className="flex flex-col gap-4 md:gap-6">
        <Row direction="left" velocityRef={velocityRef} />
        <Row direction="right" velocityRef={velocityRef} />
      </div>
    </section>
  );
}
