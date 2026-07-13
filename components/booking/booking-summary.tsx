"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { BedDouble, CalendarDays, Moon, Tag, Users } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { GlassButton } from "@/components/ui/glass-button";
import { type BookingRoom } from "@/constants/booking";
import {
  computeQuote,
  inr,
  nightsBetween,
  prettyDate,
  type AppliedPromo,
  type SearchState,
} from "./shared";

type BookingSummaryProps = {
  search: SearchState;
  room: BookingRoom | null;
  promo: AppliedPromo;
  /** Show the continue CTA (hidden on the guest step, which has its own). */
  showContinue?: boolean;
  onContinue?: () => void;
};

/** Sticky, live-updating reservation summary. */
export function BookingSummary({
  search,
  room,
  promo,
  showContinue = true,
  onContinue,
}: BookingSummaryProps) {
  const nights = Math.max(1, nightsBetween(search.checkIn, search.checkOut));
  const quote = room ? computeQuote(room, search, promo) : null;

  const totalRef = useRef<HTMLSpanElement>(null);
  const shownTotal = useRef(0);

  // Animate the total whenever it changes — count up/down + soft pulse.
  useLayoutEffect(() => {
    const el = totalRef.current;
    const target = quote?.total ?? 0;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = inr(target);
      shownTotal.current = target;
      return;
    }
    const counter = { n: shownTotal.current };
    const tween = gsap.to(counter, {
      n: target,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = inr(counter.n);
      },
      onComplete: () => {
        shownTotal.current = target;
      },
    });
    const pulse = gsap.fromTo(
      el,
      { color: "var(--accent)" },
      { color: "var(--foreground)", duration: 0.9, ease: "power2.out" },
    );
    return () => {
      tween.kill();
      pulse.kill();
      shownTotal.current = target;
    };
  }, [quote?.total]);

  return (
    <aside
      aria-label="Booking summary"
      className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-28"
    >
      <p className="eyebrow">
        <span className="h-px w-8 bg-accent" aria-hidden />
        Your Stay
      </p>

      {/* Stay facts */}
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 text-accent" aria-hidden /> Check-in
          </dt>
          <dd className="text-right font-medium text-foreground">
            {prettyDate(search.checkIn)}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 text-accent" aria-hidden /> Check-out
          </dt>
          <dd className="text-right font-medium text-foreground">
            {prettyDate(search.checkOut)}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-muted-foreground">
            <Moon className="size-4 text-accent" aria-hidden /> Nights
          </dt>
          <dd className="font-medium text-foreground">{nights}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-muted-foreground">
            <Users className="size-4 text-accent" aria-hidden /> Guests
          </dt>
          <dd className="text-right font-medium text-foreground">
            {search.adults} adult{search.adults === 1 ? "" : "s"}
            {search.children > 0 &&
              ` · ${search.children} child${search.children === 1 ? "" : "ren"}`}{" "}
            · {search.rooms} room{search.rooms === 1 ? "" : "s"}
          </dd>
        </div>
      </dl>

      {/* Selected room */}
      <div className="mt-5 border-t border-border pt-5">
        {room ? (
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={room.image}
                alt={room.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg text-foreground">{room.name}</p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <BedDouble className="size-3.5 text-accent" aria-hidden /> {room.bed}
              </p>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
            Select a room to see your total
          </p>
        )}
      </div>

      {/* Pricing */}
      {quote && (
        <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {inr(quote.nightly)} × {quote.nights} night{quote.nights === 1 ? "" : "s"} ×{" "}
              {quote.roomsCount}
            </dt>
            <dd className="font-medium text-foreground">{inr(quote.subtotal)}</dd>
          </div>
          {promo && (
            <div className="flex justify-between text-accent">
              <dt className="inline-flex items-center gap-1.5">
                <Tag className="size-3.5" aria-hidden /> {promo.code}
              </dt>
              <dd>−{inr(quote.promoOff)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              Taxes &amp; fees ({Math.round(quote.taxRate * 100)}%)
            </dt>
            <dd className="font-medium text-foreground">{inr(quote.taxes)}</dd>
          </div>
        </dl>
      )}

      {/* Total */}
      <div
        aria-live="polite"
        className="mt-5 flex items-baseline justify-between border-t border-border pt-5"
      >
        <span className="text-sm font-medium text-foreground">
          {promo ? "Final total" : "Estimated total"}
        </span>
        <span ref={totalRef} className="font-serif text-3xl text-foreground">
          {inr(quote?.total ?? 0)}
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        Sample rates, tax-exclusive — a front-end preview of our reservation desk.
      </p>

      {showContinue && (
        <div className="mt-5">
          <GlassButton
            size="md"
            fullWidth
            onClick={onContinue}
            disabled={!room}
            aria-label="Continue to guest details"
          >
            Continue
          </GlassButton>
          {!room && (
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Choose a room above to continue
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
