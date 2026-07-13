import { IMAGES, img } from "@/lib/images";
import type { EventVenue } from "@/types";

export const EVENTS: EventVenue[] = [
  {
    slug: "wedding",
    name: "Weddings",
    category: "Celebrations",
    tagline: "Where every celebration begins with feeling",
    description:
      "Elegant indoor settings and open-air venues that transform your most important day into a cherished memory.",
    longDescription:
      "At Park Selections, every celebration begins with feeling. Our refined interiors and thoughtfully designed spaces adapt to your vision - from an intimate ceremony to a grand reception. Modern luxury blends with cultural warmth, and our team choreographs every detail so you can simply be present.",
    capacity: "Up to 500 Guests",
    image: img(IMAGES.wedding),
    gallery: [img(IMAGES.wedding), img(IMAGES.eventHall), img(IMAGES.reception)],
    highlights: [
      "Haldi & Mehndi ceremonies",
      "Pre-wedding shoots",
      "Grand wedding receptions",
      "Bespoke décor & catering",
      "Dedicated event concierge",
    ],
  },
  {
    slug: "engagement",
    name: "Engagements",
    category: "Celebrations",
    tagline: "The beginning of forever",
    description:
      "Intimate, beautifully styled spaces to mark the moment two families come together.",
    longDescription:
      "An engagement is the first of many celebrations. Our flexible venues set the perfect tone - warm lighting, refined interiors and personalised service that adapts to the size and spirit of your gathering.",
    capacity: "Up to 250 Guests",
    image: img(IMAGES.engagement),
    gallery: [img(IMAGES.engagement), img(IMAGES.reception), img(IMAGES.eventHall)],
    highlights: [
      "Ring ceremony staging",
      "Customised floral décor",
      "Curated menus",
      "Photography-ready settings",
    ],
  },
  {
    slug: "reception",
    name: "Receptions",
    category: "Celebrations",
    tagline: "An evening to remember",
    description:
      "Grand halls and open-air terraces for receptions that flow effortlessly from welcome to farewell.",
    longDescription:
      "Whether a wedding reception or a milestone celebration, our spaces are built for gatherings that linger in memory. Seamless service, considered lighting and flexible layouts let the evening unfold exactly as you imagined.",
    capacity: "Up to 500 Guests",
    image: img(IMAGES.reception),
    gallery: [img(IMAGES.reception), img(IMAGES.eventHall), img(IMAGES.wedding)],
    highlights: [
      "Indoor & open-air options",
      "Stage & sound arrangements",
      "Multi-cuisine catering",
      "Valet & guest management",
    ],
  },
  {
    slug: "corporate-meetings",
    name: "Corporate Meetings",
    category: "Business",
    tagline: "Where business feels considered",
    description:
      "Purpose-built spaces for conferences, board meetings and corporate events.",
    longDescription:
      "Productive by design, our meeting and conference spaces pair modern audio-visual infrastructure with refined comfort. From focused board sessions to full-day conferences, our team handles the logistics so your delegates can focus on what matters.",
    capacity: "10 – 300 Delegates",
    image: img(IMAGES.corporate),
    gallery: [img(IMAGES.corporate), img(IMAGES.eventHall), img(IMAGES.reception)],
    highlights: [
      "Modern A/V & connectivity",
      "Flexible seating layouts",
      "Business lunches & breaks",
      "On-site coordination",
    ],
  },
];

export function getEvent(slug: string) {
  return EVENTS.find((event) => event.slug === slug);
}
