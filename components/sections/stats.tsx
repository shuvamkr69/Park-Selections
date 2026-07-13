"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { CONTENT } from "@/constants/content";
import { Container } from "@/components/ui/container";

/**
 * Stats band. Numbers count up progressively as the section scrolls into
 * view, each cell rises and fades in on a stagger, and an accent underline
 * sweeps out beneath every figure. All colours and fonts come from the
 * centralized tokens (app/theme.css, config/fonts.ts).
 */
export function Stats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nums = root.querySelectorAll<HTMLElement>("[data-num]");

    // Reduced motion: show final values immediately, no animation.
    if (prefersReducedMotion()) {
      nums.forEach((el) => {
        el.textContent = `${el.dataset.value}${el.dataset.suffix ?? ""}`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Hidden starting state (set before paint so nothing flashes).
      gsap.set("[data-cell]", { y: 44, autoAlpha: 0 });
      gsap.set("[data-bar]", { scaleX: 0 });

      ScrollTrigger.create({
        trigger: root,
        start: "top 78%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // 1 - cells rise + fade in on a stagger
          tl.to("[data-cell]", {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.12,
          });

          // 2 - each figure counts up progressively (synced to its cell)
          nums.forEach((el, i) => {
            const target = Number(el.dataset.value ?? 0);
            const suffix = el.dataset.suffix ?? "";
            const counter = { n: 0 };
            tl.to(
              counter,
              {
                n: target,
                duration: 1.7,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent = `${Math.round(counter.n)}${suffix}`;
                },
              },
              0.15 + i * 0.12,
            );
          });

          // 3 - accent underline sweeps out beneath each figure
          tl.to("[data-bar]", { scaleX: 1, duration: 1, stagger: 0.12 }, 0.35);
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-28">
      {/* Soft gold glow anchored to the top edge for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-20"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, var(--accent), transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
          <span className="eyebrow justify-center">By the numbers</span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-primary-foreground md:text-5xl">
            A STANDARD YOU CAN MEASURE
          </h2>
        </div>

        <div
          ref={rootRef}
          className="grid grid-cols-2 gap-y-14 md:grid-cols-4 md:gap-y-0"
        >
          {CONTENT.stats.map((stat) => (
            <div
              key={stat.label}
              data-cell
              className="px-4 text-center md:px-8 md:not-last:border-r md:border-primary-foreground/15"
            >
              <div className="flex items-baseline justify-center">
                <span
                  data-num
                  data-value={stat.value}
                  data-suffix={stat.suffix ?? ""}
                  className="text-gradient-gold font-sans text-5xl font-black tabular-nums md:text-7xl"
                >
                  0{stat.suffix ?? ""}
                </span>
              </div>

              {/* underline track + animated accent fill */}
              <div className="mx-auto mt-5 h-[3px] w-12 overflow-hidden rounded-full bg-primary-foreground/15">
                <div
                  data-bar
                  className="h-full w-full origin-left rounded-full bg-accent"
                />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70 md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
