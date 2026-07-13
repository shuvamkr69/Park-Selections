import { IMAGES, img } from "@/lib/images";
import { SITE } from "@/constants/site";

/**
 * Booking data for the on-site reservation experience (/booking).
 *
 * Room ids, names, descriptions, capacities, sizes, bedding, amenity groups,
 * rack rates and photography mirror the hotel's official STAAH booking engine
 * — recreated here as a fully front-end prototype (no payments, no backend,
 * no external integration). Rates are indicative samples.
 */

export const BOOKING_URL = SITE.contact.bookingUrl;

/** Deep-link the official engine to a single room category (external ref). */
export function roomBookingUrl(roomId: string) {
  return BOOKING_URL.replace(/RoomID=[^&]*/, `RoomID=${roomId}`);
}

/* ── Pricing model (sample rates, tax-exclusive like the engine) ────────── */

/** Direct-booking discount applied to the rack rate (as on the engine). */
export const DIRECT_DISCOUNT = 0.15;

/** Indicative GST slab for Indian hotel rooms. */
export function taxRateFor(nightly: number) {
  return nightly <= 7500 ? 0.12 : 0.18;
}

export const PROMO_CODES: Record<string, { pct: number; label: string }> = {
  PARK10: { pct: 10, label: "10% seasonal saving" },
  WELCOME5: { pct: 5, label: "5% welcome saving" },
};

/* ── Property policies (official) ───────────────────────────────────────── */

export const BOOKING_POLICIES = [
  { label: "Check-in", value: "From 2:00 PM" },
  { label: "Check-out", value: "By 12:00 PM" },
  { label: "Children", value: "Child above 6 yrs: ₹1,500 + tax per night" },
  { label: "Smoking", value: "Non-smoking rooms" },
];

/* ── Rooms ──────────────────────────────────────────────────────────────── */

export type BookingRoom = {
  roomId: string;
  name: string;
  category: "Room" | "Suite";
  description: string;
  longDescription: string;
  guests: string;
  maxAdults: number;
  maxChildren: number;
  size: string;
  sizeValue: number;
  bed: string;
  bedType: "king" | "twin";
  view?: string;
  /** Official rack rate (₹ / night). */
  rackRate: number;
  /** Units in inventory — used as the popularity signal. */
  popularity: number;
  amenities: string[];
  amenityGroups: Record<string, string[]>;
  image: string;
  gallery: string[];
};

/** Sample nightly rate after the direct-booking discount. */
export function directRate(room: BookingRoom) {
  return Math.round(room.rackRate * (1 - DIRECT_DISCOUNT));
}

const g = (file: string, w = 1600) => img(`staah:${file}`, w);

export const BOOKING_ROOMS: BookingRoom[] = [
  {
    roomId: "242632",
    name: "Deluxe Twin",
    category: "Room",
    description:
      "Comfort and convenience with two well-appointed beds, modern interiors and a functional layout for a relaxing, productive stay.",
    longDescription:
      "Deluxe Twin Room offers comfort and convenience with two well-appointed beds. Designed with modern interiors and functional space, the room ensures a relaxing and productive stay. Each bed features premium linens for a restful night's sleep, while a dedicated work desk with ergonomic seating and high-speed Wi-Fi supports business needs.",
    guests: "Up to 3 Guests",
    maxAdults: 3,
    maxChildren: 1,
    size: "330 sq ft",
    sizeValue: 330,
    bed: "Two Queen Beds",
    bedType: "twin",
    view: "City View",
    rackRate: 5500,
    popularity: 12,
    amenities: ["Free Wi-Fi", "Air-conditioning", "TV", "Mini Bar", "Daily Housekeeping"],
    amenityGroups: {
      "Bathroom Features": ["Private Bathroom", "Shower", "Toiletries", "Towels"],
      "Climate Control": ["Air-conditioning", "Fans"],
      Entertainment: ["TV"],
      "General Amenities": ["Bathrobes", "Daily Housekeeping", "Free Parking", "Hair Dryer", "Phone", "Room Slippers"],
      Internet: ["Free Wi-Fi"],
      "Kitchen Features": ["Electric Kettle", "Free Bottled Water", "Mini Bar", "Tea/Coffee Facilities"],
      "Room Features": ["Work Desk", "In-room Safe", "Electronic Door Lock", "Bedside Lights", "Non-smoking"],
    },
    image: img(IMAGES.deluxeTwin, 900),
    gallery: [
      g("14113_1775644387754.jpeg"),
      g("14113_1775644422974.jpeg"),
      g("14113_1775644423014.jpeg"),
      g("14113_1775644422917.jpeg"),
    ],
  },
  {
    roomId: "242633",
    name: "Deluxe King",
    category: "Room",
    description:
      "A luxuriously comfortable king bed dressed in fine linens, a spacious work area and large windows framing pleasant views.",
    longDescription:
      "Deluxe room features a luxuriously comfortable bed dressed in fine linens, complemented by a spacious work area tailored for business needs. Large windows frame pleasant views, enhancing the sense of space and tranquility. Guests can enjoy a range of modern conveniences, including high-speed internet, an in-room entertainment system, and a well-stocked minibar. The sleek bathroom, fitted with premium fixtures, offers a rejuvenating experience with quality toiletries and plush towels.",
    guests: "Up to 3 Guests",
    maxAdults: 3,
    maxChildren: 1,
    size: "330 sq ft",
    sizeValue: 330,
    bed: "King Bed",
    bedType: "king",
    view: "City View",
    rackRate: 6000,
    popularity: 23,
    amenities: ["Free Wi-Fi", "Air-conditioning", "Satellite TV", "Mini Bar", "Bathrobes"],
    amenityGroups: {
      "Bathroom Features": ["Private Bathroom", "Shower", "Toiletries", "Towels"],
      "Climate Control": ["Air-conditioning", "Fans"],
      Entertainment: ["Satellite / Cable TV"],
      "General Amenities": ["Alarm Clock", "Bathrobes", "Daily Housekeeping", "Free Parking", "Hair Dryer", "Room Slippers"],
      Internet: ["Free Wi-Fi"],
      "Kitchen Features": ["Electric Kettle", "Mini Bar"],
      "Room Features": ["Work Desk", "Electronic Door Lock", "Bedside Lights", "Non-smoking"],
    },
    image: img(IMAGES.deluxeKing, 900),
    gallery: [
      g("14113_1775218772678.jpeg"),
      g("14113_1775644183438.jpeg"),
      g("14113_1775644202894.jpeg"),
      g("14113_1775644202855.jpeg"),
    ],
  },
  {
    roomId: "242634",
    name: "Premium Room",
    category: "Room",
    description:
      "A plush king-size bed, ergonomic work desk and upgraded in-room features beneath abundant natural light and city views.",
    longDescription:
      "Relax on a plush king-size bed with premium linens, or stay productive at a spacious work desk with ergonomic seating and high-speed Wi-Fi. Large windows provide abundant natural light along with city view. Enjoy upgraded in-room features including a smart flat-screen TV, minibar, tea and coffee maker, and additional seating for relaxation. The well-appointed bathroom includes a walk-in shower or bathtub, premium toiletries, and soft, fresh towels.",
    guests: "Up to 3 Guests",
    maxAdults: 3,
    maxChildren: 1,
    size: "380 sq ft",
    sizeValue: 380,
    bed: "King Bed",
    bedType: "king",
    view: "City View",
    rackRate: 6500,
    popularity: 6,
    amenities: ["High-speed Wi-Fi", "Smart TV", "Air-conditioning", "Mini Bar", "Room Slippers"],
    amenityGroups: {
      "Bathroom Features": ["Private Bathroom", "Walk-in Shower or Bathtub", "Toiletries", "Towels"],
      "Climate Control": ["Air-conditioning", "Fans"],
      Entertainment: ["Smart Flat-screen TV", "Satellite / Cable TV"],
      "General Amenities": ["Bathrobes", "Daily Housekeeping", "Free Parking", "Hair Dryer", "Room Slippers"],
      Internet: ["High-speed Wi-Fi"],
      "Kitchen Features": ["Electric Kettle", "Tea & Coffee Maker", "Mini Bar"],
      "Room Features": ["Ergonomic Work Desk", "Electronic Door Lock", "Additional Seating", "Non-smoking"],
    },
    image: img(IMAGES.premiumKing, 900),
    gallery: [
      g("14113_1775218772658.jpeg"),
      g("14113_1775218772639.jpeg"),
      g("14113_1775644202855.jpeg"),
    ],
  },
  {
    roomId: "242635",
    name: "Junior Suite",
    category: "Suite",
    description:
      "A separate living area and bedroom in perfect balance — elevated comfort for guests who value privacy, style and functionality.",
    longDescription:
      "Experience elevated comfort in our spacious Junior Suite, thoughtfully designed for guests who value privacy, style, and functionality. Featuring a separate living area and bedroom, the suite offers the perfect balance between work and relaxation. The bedroom includes a plush king-size bed, while the living area is furnished with a comfortable sofa and coffee table.",
    guests: "Up to 3 Guests",
    maxAdults: 3,
    maxChildren: 1,
    size: "450 sq mtr",
    sizeValue: 450,
    bed: "King Bed + Sofa",
    bedType: "king",
    view: "City View",
    rackRate: 7000,
    popularity: 3,
    amenities: ["Free Wi-Fi", "Separate Living Area", "Satellite TV", "Mini Bar", "Daily Housekeeping"],
    amenityGroups: {
      "Bathroom Features": ["Private Bathroom", "Shower", "Toiletries", "Towels"],
      "Climate Control": ["Air-conditioning", "Fans"],
      Entertainment: ["Satellite / Cable TV"],
      "General Amenities": ["Daily Housekeeping", "Free Parking", "Hair Dryer", "Room Slippers"],
      Internet: ["Free Wi-Fi"],
      "Kitchen Features": ["Electric Kettle", "Free Bottled Water", "Mini Bar"],
      "Suite Features": ["Separate Living Area", "Sofa & Coffee Table", "Work Desk", "Electronic Door Lock"],
    },
    image: img(IMAGES.juniorSuite, 900),
    gallery: [
      g("14113_1775218772718.jpeg"),
      g("14113_1775218772658.jpeg"),
      g("14113_1775218772698.jpeg"),
    ],
  },
  {
    roomId: "242636",
    name: "Suite",
    category: "Suite",
    description:
      "Our most spacious stay — separate living and sleeping quarters with a full suite of premium amenities and considered detail.",
    longDescription:
      "Experience elevated comfort in our most spacious Suite, thoughtfully designed for guests who value privacy, style, and functionality. Featuring a separate living area and bedroom, the suite offers the perfect balance between work and relaxation. The bedroom includes a plush king-size bed, while the living area is furnished with a comfortable sofa and coffee table. The bathroom offers a separate shower and bath with a vanity basin and mirror.",
    guests: "Up to 3 Guests",
    maxAdults: 3,
    maxChildren: 1,
    size: "500 sq ft",
    sizeValue: 500,
    bed: "King Bed + Living Room",
    bedType: "king",
    rackRate: 7500,
    popularity: 3,
    amenities: ["Free Wi-Fi", "Separate Shower & Bath", "Satellite TV", "Mini Bar", "Bathrobes"],
    amenityGroups: {
      "Bathroom Features": ["Private Bathroom", "Separate Shower & Bath", "Vanity Basin & Mirror", "Toiletries", "Towels"],
      "Climate Control": ["Air-conditioning", "Fans"],
      Entertainment: ["Satellite / Cable TV"],
      "General Amenities": ["Bathrobes", "Daily Housekeeping", "Free Parking", "Hair Dryer", "Room Slippers"],
      Internet: ["Free Wi-Fi"],
      "Kitchen Features": ["Electric Kettle", "Free Bottled Water", "Mini Bar"],
      "Suite Features": ["Separate Living Room", "Sofa & Coffee Table", "Coat Hangers", "Electronic Door Lock"],
    },
    image: img(IMAGES.suite, 900),
    gallery: [
      g("14113_1775644234274.jpeg"),
      g("14113_1775644387734.jpeg"),
      g("14113_1775644314274.jpeg"),
      g("14113_1775218772698.jpeg"),
      g("14113_1775644387677.jpeg"),
    ],
  },
];

export function getBookingRoom(roomId: string) {
  return BOOKING_ROOMS.find((r) => r.roomId === roomId);
}
