"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/constants/testimonials";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((prev) => (next + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Animate on change
  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }, cardRef);
    return () => ctx.revert();
  }, [index]);

  // Autoplay
  useEffect(() => {
    timer.current = setInterval(() => go(index + 1), 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [index, go]);

  const active = TESTIMONIALS[index];

  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="Guest Stories"
          title="Loved by those who stay"
          description="A stay that stays in your heart — in the words of our guests."
        />

        <div className="mx-auto mt-14 max-w-3xl text-center">
          <div ref={cardRef}>
            <Quote className="mx-auto size-10 text-accent" />
            <div className="mt-6 flex justify-center gap-1">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} className="size-5 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="mt-6 font-serif text-2xl leading-snug text-foreground md:text-3xl">
              “{active.quote}”
            </blockquote>
            <div className="mt-6">
              <p className="font-medium text-foreground">{active.author}</p>
              <p className="text-sm text-muted-foreground">{active.role}</p>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous testimonial"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => go(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-accent" : "w-2 bg-border",
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next testimonial"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
