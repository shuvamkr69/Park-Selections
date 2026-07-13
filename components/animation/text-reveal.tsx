"use client";

import { useLayoutEffect, useRef, type ElementType } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { animations } from "@/config/animations";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string | readonly string[];
  as?: ElementType;
  className?: string;
  /** Animate on mount instead of on scroll (used for the hero). */
  immediate?: boolean;
  delay?: number;
};

/**
 * Word-by-word masked headline reveal. Accepts a string or an array of lines
 * (each array entry becomes its own line/mask row).
 */
export function TextReveal({
  text,
  as,
  className,
  immediate = false,
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "h2") as ElementType;
  const lines: string[] = Array.isArray(text) ? [...text] : [text];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    const { from, to } = animations.textReveal();

    // Set hidden state immediately so nothing is visible under the preloader.
    const ctx = gsap.context(() => {
      gsap.set(words, from);
    }, el);

    let plListener: (() => void) | null = null;
    let destroyed = false;

    const play = () => {
      if (destroyed) return;
      gsap.to(words, {
        ...to,
        delay,
        scrollTrigger: immediate
          ? undefined
          : {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
      });
    };

    if (immediate && !sessionStorage.getItem("ps-preloaded")) {
      // On first-ever load: wait for the preloader outro to begin before
      // revealing the headline - this is the cinematic hand-off moment.
      plListener = play;
      window.addEventListener("pl:done", play, { once: true });
    } else {
      play();
    }

    return () => {
      destroyed = true;
      if (plListener) window.removeEventListener("pl:done", plListener);
      ctx.revert();
    };
  }, [immediate, delay]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.08em]">
          {line.split(" ").map((word, wi) => (
            <span
              key={wi}
              className="inline-block overflow-hidden align-bottom"
            >
              <span data-word className="inline-block will-change-transform">
                {word}
                {wi < line.split(" ").length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
