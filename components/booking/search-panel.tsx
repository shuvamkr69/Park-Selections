"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { CalendarDays, Minus, Moon, Plus, Tag, Check, X } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import {
  addDaysISO,
  nightsBetween,
  toISO,
  type AppliedPromo,
  type SearchState,
} from "./shared";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

const labelClass =
  "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground";

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex h-[46px] items-center justify-between rounded-lg border border-border bg-background px-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <Minus className="size-4" />
        </button>
        <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-foreground">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

type SearchPanelProps = {
  search: SearchState;
  onChange: (next: SearchState) => void;
  promo: AppliedPromo;
  onApplyPromo: (code: string) => boolean;
  onClearPromo: () => void;
  onSearch: () => void;
};

/** Booking search bar — dates, party steppers, promo code, live nights. */
export function SearchPanel({
  search,
  onChange,
  promo,
  onApplyPromo,
  onClearPromo,
  onSearch,
}: SearchPanelProps) {
  const today = toISO(new Date());
  const nights = nightsBetween(search.checkIn, search.checkOut);
  const datesValid = search.checkIn >= today && nights >= 1;

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);
  const nightsRef = useRef<HTMLSpanElement>(null);

  // Micro-interaction: the nights badge pops whenever the count changes.
  useLayoutEffect(() => {
    if (!nightsRef.current || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      nightsRef.current,
      { scale: 1.25 },
      { scale: 1, duration: 0.45, ease: "back.out(2.5)" },
    );
    return () => {
      tween.kill();
    };
  }, [nights]);

  const setCheckIn = (checkIn: string) => {
    // Keep the stay valid: check-out always after check-in.
    const checkOut =
      nightsBetween(checkIn, search.checkOut) >= 1
        ? search.checkOut
        : addDaysISO(checkIn, 1);
    onChange({ ...search, checkIn, checkOut });
  };

  const applyPromo = () => {
    const code = promoInput.trim();
    if (!code) return;
    const ok = onApplyPromo(code);
    setPromoError(!ok);
    if (ok) setPromoInput("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto_auto_auto_1fr]">
        <div>
          <label htmlFor="bk-checkin" className={labelClass}>
            Check-in
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-accent" />
            <input
              id="bk-checkin"
              type="date"
              min={today}
              value={search.checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="bk-checkout" className={labelClass}>
            Check-out
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-accent" />
            <input
              id="bk-checkout"
              type="date"
              min={addDaysISO(search.checkIn, 1)}
              value={search.checkOut}
              onChange={(e) => onChange({ ...search, checkOut: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>

        <Stepper
          label="Adults"
          value={search.adults}
          min={1}
          max={9}
          onChange={(adults) => onChange({ ...search, adults })}
        />
        <Stepper
          label="Children"
          value={search.children}
          min={0}
          max={4}
          onChange={(children) => onChange({ ...search, children })}
        />
        <Stepper
          label="Rooms"
          value={search.rooms}
          min={1}
          max={5}
          onChange={(rooms) => onChange({ ...search, rooms })}
        />

        <div>
          <label htmlFor="bk-promo" className={labelClass}>
            Promo Code
          </label>
          {promo ? (
            <div className="flex h-[46px] items-center justify-between gap-2 rounded-lg border border-accent/50 bg-accent/10 px-4">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <Check className="size-4 text-accent" aria-hidden />
                {promo.code}
              </span>
              <button
                type="button"
                onClick={onClearPromo}
                aria-label={`Remove promo code ${promo.code}`}
                className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent" />
              <input
                id="bk-promo"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value.toUpperCase());
                  setPromoError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                placeholder="e.g. PARK10"
                aria-invalid={promoError}
                className={cn(fieldClass, "pl-10 pr-16 uppercase", promoError && "border-red-400")}
              />
              <button
                type="button"
                onClick={applyPromo}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Apply
              </button>
            </div>
          )}
          <p aria-live="polite" className="mt-1 min-h-4 text-xs text-red-500">
            {promoError ? "This code isn't valid." : ""}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-stretch justify-between gap-5 border-t border-border/70 pt-5 sm:flex-row sm:items-center">
        <p className="inline-flex items-center gap-2.5 text-sm text-muted-foreground">
          <Moon className="size-4 text-accent" aria-hidden />
          <span aria-live="polite">
            <span
              ref={nightsRef}
              className="inline-block font-serif text-xl leading-none text-foreground"
            >
              {Math.max(nights, 0)}
            </span>{" "}
            night{nights === 1 ? "" : "s"} ·{" "}
            {search.adults + search.children} guest
            {search.adults + search.children === 1 ? "" : "s"} · {search.rooms} room
            {search.rooms === 1 ? "" : "s"}
          </span>
        </p>
        <GlassButton size="md" onClick={onSearch} disabled={!datesValid}>
          Search Availability
        </GlassButton>
      </div>
      {!datesValid && (
        <p className="mt-3 text-xs text-red-500" role="alert">
          Please choose a check-out date after your check-in date.
        </p>
      )}
    </div>
  );
}
