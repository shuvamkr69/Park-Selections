"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  BedDouble,
  Check,
  Flame,
  Info,
  Maximize,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import { directRate, type BookingRoom } from "@/constants/booking";
import { inr, nightsBetween, type SearchState } from "./shared";

type SortKey = "recommended" | "price-asc" | "price-desc" | "size" | "popularity";
type CategoryKey = "all" | "Room" | "Suite";
type BedKey = "all" | "king" | "twin";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All Categories" },
  { key: "Room", label: "Rooms" },
  { key: "Suite", label: "Suites" },
];

const selectClass =
  "h-10 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

type RoomResultsProps = {
  rooms: BookingRoom[];
  search: SearchState;
  selectedRoomId?: string;
  onDetails: (room: BookingRoom) => void;
  onReserve: (room: BookingRoom) => void;
};

/** Availability results — interactive filters, sorting and staggered cards. */
export function RoomResults({
  rooms,
  search,
  selectedRoomId,
  onDetails,
  onReserve,
}: RoomResultsProps) {
  const priceBounds = useMemo(() => {
    const rates = rooms.map(directRate);
    return { min: Math.min(...rates), max: Math.max(...rates) };
  }, [rooms]);

  const [category, setCategory] = useState<CategoryKey>("all");
  const [bed, setBed] = useState<BedKey>("all");
  const [minGuests, setMinGuests] = useState(0);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [sort, setSort] = useState<SortKey>("recommended");

  const listRef = useRef<HTMLDivElement>(null);
  const nights = Math.max(1, nightsBetween(search.checkIn, search.checkOut));

  const visible = useMemo(() => {
    const filtered = rooms.filter(
      (r) =>
        (category === "all" || r.category === category) &&
        (bed === "all" || r.bedType === bed) &&
        (minGuests === 0 || r.maxAdults + r.maxChildren >= minGuests) &&
        directRate(r) <= maxPrice,
    );
    const by: Record<SortKey, (a: BookingRoom, b: BookingRoom) => number> = {
      recommended: () => 0,
      "price-asc": (a, b) => directRate(a) - directRate(b),
      "price-desc": (a, b) => directRate(b) - directRate(a),
      size: (a, b) => b.sizeValue - a.sizeValue,
      popularity: (a, b) => b.popularity - a.popularity,
    };
    return [...filtered].sort(by[sort]);
  }, [rooms, category, bed, minGuests, maxPrice, sort, search.adults]);

  // Re-stagger the cards whenever the visible set changes.
  const listKey = `${category}|${bed}|${minGuests}|${maxPrice}|${sort}`;
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el || prefersReducedMotion()) return;
    const cards = el.querySelectorAll("[data-room-card]");
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out", stagger: 0.09 },
      );
    }, el);
    return () => ctx.revert();
  }, [listKey]);

  return (
    <div>
      {/* ── Filters & sorting ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Refine
          </span>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Room category">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                aria-pressed={category === c.key}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300",
                  category === c.key
                    ? "border-accent bg-accent text-accent-foreground shadow-soft"
                    : "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            Bed
            <select
              value={bed}
              onChange={(e) => setBed(e.target.value as BedKey)}
              className={selectClass}
            >
              <option value="all">Any</option>
              <option value="king">King</option>
              <option value="twin">Twin</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            Sleeps
            <select
              value={minGuests}
              onChange={(e) => setMinGuests(Number(e.target.value))}
              className={selectClass}
            >
              <option value={0}>Any</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-3 text-xs text-muted-foreground">
            <span className="whitespace-nowrap">
              Up to <span className="font-semibold text-foreground">{inr(maxPrice)}</span>
            </span>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum nightly price"
              className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-border accent-[var(--accent)]"
            />
          </label>

          <label className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={selectClass}
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price · low to high</option>
              <option value="price-desc">Price · high to low</option>
              <option value="size">Room size</option>
              <option value="popularity">Popularity</option>
            </select>
          </label>
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {visible.length} of {rooms.length} categories available
      </p>

      {/* ── Room cards ───────────────────────────────────────────────── */}
      <div ref={listRef} className="mt-4 flex flex-col gap-6">
        {visible.map((room) => {
          const nightly = directRate(room);
          const selected = room.roomId === selectedRoomId;
          return (
            <article
              key={room.roomId}
              data-room-card
              className={cn(
                "group grid overflow-hidden rounded-2xl bg-card shadow-soft ring-1 transition-all duration-500 hover:shadow-card md:grid-cols-[minmax(0,17rem)_1fr]",
                selected ? "ring-2 ring-accent" : "ring-border/60 hover:ring-border",
              )}
            >
              <button
                type="button"
                onClick={() => onDetails(room)}
                aria-label={`View details for ${room.name}`}
                className="relative block h-52 overflow-hidden text-left md:h-full"
              >
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 17rem"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                {room.popularity <= 6 && (
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-black backdrop-blur">
                    <Flame className="size-3 text-accent" aria-hidden />
                    Only {room.popularity} left
                  </span>
                )}
                {selected && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
                    <Check className="size-3" aria-hidden /> Selected
                  </span>
                )}
              </button>

              <div className="flex flex-col gap-4 p-6 md:flex-row md:items-stretch md:gap-8 md:p-7">
                <div className="min-w-0 flex-1">
                  <p className="eyebrow">{room.category === "Suite" ? "Suite" : "Guest Room"}</p>
                  <h3 className="mt-1.5 font-serif text-2xl text-foreground">{room.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {room.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Maximize className="size-3.5 text-accent" /> {room.size}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BedDouble className="size-3.5 text-accent" /> {room.bed}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5 text-accent" /> {room.guests}
                    </span>
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                    {room.amenities.slice(0, 4).map((a) => (
                      <li
                        key={a}
                        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-foreground/70"
                      >
                        <Check className="size-3 text-accent" aria-hidden />
                        {a}
                      </li>
                    ))}
                    <li>
                      <button
                        type="button"
                        onClick={() => onDetails(room)}
                        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent underline-offset-4 hover:underline"
                      >
                        + more
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Price + actions */}
                <div className="flex shrink-0 flex-row items-end justify-between gap-4 border-t border-border/70 pt-4 md:w-44 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-7 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-muted-foreground line-through">
                      {inr(room.rackRate)}
                    </p>
                    <p className="font-serif text-3xl leading-none text-foreground">
                      {inr(nightly)}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">per night</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Info className="size-3 text-accent" aria-hidden />
                      Excl. taxes &amp; fees
                    </p>
                    {nights > 1 && (
                      <p className="mt-1.5 text-[11px] font-medium text-foreground/70">
                        {inr(nightly * nights * search.rooms)} for {nights} nights
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <GlassButton
                      size="sm"
                      onClick={() => onReserve(room)}
                      aria-label={`Reserve the ${room.name}`}
                    >
                      {selected ? "Reserved" : "Reserve"}
                    </GlassButton>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
            <p className="font-serif text-xl text-foreground">No rooms match these filters</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try widening the price range or clearing a filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
