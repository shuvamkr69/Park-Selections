"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TESTIMONIALS } from "@/constants/testimonials";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/animation/reveal";
import { TextReveal } from "@/components/animation/text-reveal";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Guest stories — editorial testimonial stage.
 *
 * Left column carries the section identity and an aggregate rating; the right
 * column is a rotating "stage" where each quote enters word-by-word through
 * masked spans (GSAP), with an autoplay progress line, author tabs and arrows.
 * Autoplay pauses while hovered or focused. Fully driven by the existing
 * TESTIMONIALS data source.
 */

const HOLD = 7; // seconds each story stays on stage

const AVERAGE = (
  TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length
).toFixed(1);

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter((c) => c && /[A-Za-z]/.test(c))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [entered, setEntered] = useState(false);
  const enteredRef = useRef(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<gsap.core.Tween | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Reduced motion: skip entrance choreography but keep the rotation alive.
  useEffect(() => {
    if (prefersReducedMotion()) {
      enteredRef.current = true;
      setEntered(true);
    }
  }, []);

  // Entrance (first view) + per-story word reveal.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const words = stage.querySelectorAll<HTMLElement>("[data-word]");
      const meta = metaRef.current;

      const play = () => {
        gsap.to(words, {
          yPercent: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.016,
        });
        if (meta) {
          gsap.fromTo(
            meta,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.35 },
          );
        }
      };

      gsap.set(words, { yPercent: 112 });

      if (enteredRef.current) {
        play();
        return;
      }
      ScrollTrigger.create({
        trigger: stage,
        start: "top 80%",
        once: true,
        onEnter: () => {
          enteredRef.current = true;
          setEntered(true);
          play();
        },
      });
    }, stage);

    return () => ctx.revert();
  }, [index]);

  // Autoplay, driven by the progress line so timing and UI never drift.
  useEffect(() => {
    if (!entered) return;
    const bar = barRef.current;

    if (prefersReducedMotion() || !bar) {
      const t = setTimeout(() => go(index + 1), HOLD * 1000);
      return () => clearTimeout(t);
    }

    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: HOLD, ease: "none", onComplete: () => go(index + 1) },
    );
    progressRef.current = tween;
    return () => {
      tween.kill();
      progressRef.current = null;
    };
  }, [index, entered, go]);

  const pause = () => progressRef.current?.pause();
  const resume = () => progressRef.current?.resume();

  const active = TESTIMONIALS[index];
  const words = `“${active.quote}”`.split(" ");

  return (
    <section className="relative overflow-hidden bg-muted/30 py-24 md:py-36">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          {/* ── Editorial intro ─────────────────────────────────────── */}
          <div className="flex flex-col">
            <Reveal preset="fadeIn">
              <span className="eyebrow">
                <span className="h-px w-8 bg-accent" aria-hidden />
                Guest Stories
              </span>
            </Reveal>
            <TextReveal
              as="h2"
              text={["Loved by those", "who stay"]}
              className="mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl"
            />
            <Reveal preset="fadeUp" delay={0.1}>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
                A stay that stays in your heart — in the words of our guests.
              </p>
            </Reveal>

            <Reveal preset="fadeUp" delay={0.18}>
              <div className="mt-12 flex items-end gap-5 border-t border-border pt-8 lg:mt-auto">
                <span className="text-gradient-gold font-serif text-6xl leading-none md:text-7xl">
                  {AVERAGE}
                </span>
                <div className="pb-1.5">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Average guest rating
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Rotating quote stage ────────────────────────────────── */}
          <div
            ref={stageRef}
            className="relative"
            onMouseEnter={pause}
            onMouseLeave={resume}
            onFocusCapture={pause}
            onBlurCapture={resume}
          >
            {/* Oversized quotation mark, tinted with the accent */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-16 select-none font-serif text-[9rem] leading-none text-accent/10 md:-top-24 md:text-[14rem]"
            >
              &ldquo;
            </span>

            <div className="relative pt-6 md:pt-10">
              <div className="flex gap-1">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-accent text-accent" />
                ))}
              </div>

              <blockquote
                aria-live="polite"
                className="mt-6 font-serif text-2xl leading-snug text-foreground sm:text-3xl md:text-[2.6rem] md:leading-[1.25]"
              >
                {words.map((word, i) => (
                  <span
                    key={`${index}-${i}`}
                    className="inline-block overflow-hidden align-top"
                  >
                    <span data-word className="inline-block will-change-transform">
                      {word}
                      {" "}
                    </span>
                  </span>
                ))}
              </blockquote>

              {/* Author signature */}
              <div ref={metaRef} className="mt-9 flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-accent/40 font-serif text-base text-accent">
                  {initials(active.author)}
                </span>
                <div>
                  <p className="font-medium text-foreground">{active.author}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {active.role}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Controls ────────────────────────────────────────────── */}
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-5 border-t border-border pt-7">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.author}
                  onClick={() => go(i)}
                  aria-label={`Show testimonial from ${t.author}`}
                  aria-current={i === index}
                  className={cn(
                    "group relative pb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                    i === index
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.author}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-0 h-px w-full origin-left bg-accent transition-transform duration-300",
                      i === index ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2.5">
                <button
                  onClick={() => go(index - 1)}
                  aria-label="Previous testimonial"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={() => go(index + 1)}
                  aria-label="Next testimonial"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>

            {/* Autoplay progress */}
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 overflow-hidden bg-border">
                <div
                  ref={barRef}
                  className="h-full w-full origin-left scale-x-0 bg-accent"
                />
              </div>
              <span className="text-xs tabular-nums tracking-[0.2em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(TESTIMONIALS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
