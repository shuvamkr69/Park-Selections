import {
  DIRECT_DISCOUNT,
  directRate,
  taxRateFor,
  type BookingRoom,
} from "@/constants/booking";

/** Shared state types + pricing math for the /booking flow. */

export type SearchState = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
};

export type AppliedPromo = { code: string; pct: number; label: string } | null;

export type GuestState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requests: string;
};

export const EMPTY_GUEST: GuestState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  requests: "",
};

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function addDaysISO(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const ms = Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`);
  return Number.isFinite(ms) ? Math.round(ms / 86_400_000) : 0;
}

export function prettyDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type Quote = {
  nightly: number;
  rackNightly: number;
  nights: number;
  roomsCount: number;
  subtotal: number;
  promoOff: number;
  taxRate: number;
  taxes: number;
  total: number;
};

/** Full stay pricing for a room + search + promo (sample, tax-exclusive). */
export function computeQuote(
  room: BookingRoom,
  search: SearchState,
  promo: AppliedPromo,
): Quote {
  const nightly = directRate(room);
  const nights = Math.max(1, nightsBetween(search.checkIn, search.checkOut));
  const roomsCount = search.rooms;
  const subtotal = nightly * nights * roomsCount;
  const promoOff = promo ? Math.round((subtotal * promo.pct) / 100) : 0;
  const taxable = subtotal - promoOff;
  const taxRate = taxRateFor(nightly);
  const taxes = Math.round(taxable * taxRate);
  return {
    nightly,
    rackNightly: room.rackRate,
    nights,
    roomsCount,
    subtotal,
    promoOff,
    taxRate,
    taxes,
    total: taxable + taxes,
  };
}

export const DIRECT_SAVING_PCT = Math.round(DIRECT_DISCOUNT * 100);
