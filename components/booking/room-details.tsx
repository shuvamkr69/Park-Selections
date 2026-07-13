"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { BedDouble, Check, Maximize, Users, X } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import { BOOKING_POLICIES, type BookingRoom } from "@/constants/booking";
import {
  computeQuote,
  inr,
  type AppliedPromo,
  type SearchState,
} from "./shared";

type RoomDetailsProps = {
  room: BookingRoom;
  search: SearchState;
  promo: AppliedPromo;
  onClose: () => void;
  onReserve: (room: BookingRoom) => void;
};

/** Premium room-details dialog - gallery, amenities, policies, pricing. */
export function RoomDetails({
  room,
  search,
  promo,
  onClose,
  onReserve,
}: RoomDetailsProps) {
  const [activeImg, setActiveImg] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const quote = computeQuote(room, search, promo);

  // Entrance animation + focus management + scroll lock.
  useLayoutEffect(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    if (!prefersReducedMotion() && overlayRef.current && panelRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          overlayRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3 },
        );
        gsap.fromTo(
          panelRef.current,
          { y: 40, autoAlpha: 0, scale: 0.97 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.55,
            ease: "power3.out",
            delay: 0.05,
          },
        );
      });
      return () => {
        ctx.revert();
        document.documentElement.style.overflow = "";
        restoreFocus.current?.focus?.();
      };
    }
    return () => {
      document.documentElement.style.overflow = "";
      restoreFocus.current?.focus?.();
    };
  }, []);

  // Gallery cross-fade on image change.
  useLayoutEffect(() => {
    if (!heroRef.current || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      heroRef.current,
      { autoAlpha: 0.35, scale: 1.02 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, [activeImg]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-details-title"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-card shadow-card sm:rounded-2xl"
      >
        {/* Gallery */}
        <div className="relative">
          <div ref={heroRef} className="relative aspect-[16/9]">
            <Image
              key={activeImg}
              src={room.gallery[activeImg] ?? room.image}
              alt={`${room.name} - photo ${activeImg + 1}`}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close room details"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="size-5" />
          </button>

          {room.gallery.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 px-4">
              {room.gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  aria-label={`Show photo ${i + 1} of ${room.gallery.length}`}
                  aria-current={i === activeImg}
                  className={cn(
                    "relative h-12 w-16 overflow-hidden rounded-md ring-2 transition-all duration-300",
                    i === activeImg
                      ? "ring-accent"
                      : "opacity-70 ring-white/30 hover:opacity-100",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow">
              {room.category === "Suite" ? "Suite" : "Guest Room"}
              {room.view ? ` · ${room.view}` : ""}
            </p>
            <h3
              id="room-details-title"
              className="mt-2 font-serif text-3xl text-foreground"
            >
              {room.name}
            </h3>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Maximize className="size-4 text-accent" /> {room.size}
              </span>
              <span className="inline-flex items-center gap-2">
                <BedDouble className="size-4 text-accent" /> {room.bed}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="size-4 text-accent" /> {room.maxAdults} adults
                · {room.maxChildren} child
              </span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {room.longDescription}
            </p>

            {/* Amenity groups */}
            <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {Object.entries(room.amenityGroups).map(([group, items]) => (
                <div key={group}>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                    {group}
                  </h4>
                  <ul className="mt-2.5 space-y-1.5">
                    {items.map((a) => (
                      <li
                        key={a}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-accent"
                          aria-hidden
                        />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Policies */}
            <div className="mt-8 rounded-xl border border-border bg-muted/40 p-5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Good to know
              </h4>
              <dl className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {BOOKING_POLICIES.map((p) => (
                  <div
                    key={p.label}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <dt className="text-muted-foreground">{p.label}</dt>
                    <dd className="text-right font-medium text-foreground">
                      {p.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Price breakdown */}
          <aside className="h-fit rounded-xl border border-border bg-background p-6 lg:sticky lg:top-6">
            <h4 className="font-serif text-xl text-foreground">
              Price Breakdown
            </h4>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Rack rate</dt>
                <dd className="text-muted-foreground line-through">
                  {inr(quote.rackNightly)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Direct rate / night</dt>
                <dd className="font-medium text-foreground">
                  {inr(quote.nightly)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {quote.nights} night{quote.nights === 1 ? "" : "s"} ×{" "}
                  {quote.roomsCount} room
                  {quote.roomsCount === 1 ? "" : "s"}
                </dt>
                <dd className="font-medium text-foreground">
                  {inr(quote.subtotal)}
                </dd>
              </div>
              {promo && (
                <div className="flex justify-between text-accent">
                  <dt>Promo · {promo.code}</dt>
                  <dd>−{inr(quote.promoOff)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Taxes &amp; fees ({Math.round(quote.taxRate * 100)}%)
                </dt>
                <dd className="font-medium text-foreground">
                  {inr(quote.taxes)}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-foreground">
                Estimated total
              </span>
              <span className="font-serif text-2xl text-foreground">
                {inr(quote.total)}
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Sample rates for illustration - final pricing is confirmed at the
              reservation desk.
            </p>
            <div className="mt-5">
              <GlassButton size="md" fullWidth onClick={() => onReserve(room)}>
                Reserve This Room
              </GlassButton>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
