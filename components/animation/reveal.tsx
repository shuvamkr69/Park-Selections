"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { animations } from "@/config/animations";
import { cn } from "@/lib/utils";

type Preset = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleIn";

const presetMap = {
  fadeUp: animations.fadeUp,
  fadeIn: animations.fadeIn,
  slideLeft: animations.slideLeft,
  slideRight: animations.slideRight,
  scaleIn: animations.scaleIn,
};

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  preset?: Preset;
  /** Stagger direct children instead of animating the container as one. */
  stagger?: boolean;
  delay?: number;
  className?: string;
  /** Selector for children to stagger (defaults to direct element children). */
  childSelector?: string;
};

/**
 * Scroll-triggered reveal. Renders visible on the server (no FOUC / no stuck
 * content) and applies the from-state in a layout effect before paint.
 */
export function Reveal({
  children,
  as,
  preset = "fadeUp",
  stagger = false,
  delay = 0,
  className,
  childSelector,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const { from, to } = presetMap[preset]();
    const ctx = gsap.context(() => {
      const targets = stagger
        ? childSelector
          ? el.querySelectorAll(childSelector)
          : el.children
        : el;

      gsap.set(targets, from);
      gsap.to(targets, {
        ...to,
        delay,
        stagger: stagger ? animations.staggerReveal().to.stagger : undefined,
        scrollTrigger: {
          trigger: el,
          start: animations.scrollReveal.start,
          toggleActions: animations.scrollReveal.toggleActions,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [preset, stagger, delay, childSelector]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
