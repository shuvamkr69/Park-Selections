import { IMAGES, img } from "@/lib/images";
import type { Room } from "@/types";

const commonAmenities = [
  "High-speed Wi-Fi",
  "Smart flat-screen TV",
  "Tea & coffee maker",
  "Minibar",
  "Premium toiletries",
  "24-hour room service",
];

export const ROOMS: Room[] = [
  {
    slug: "deluxe-twin-city-view",
    name: "Deluxe Twin — City View",
    tagline: "Twin comfort with skyline light",
    description:
      "Two plush single beds, floor-to-ceiling light and a calming city outlook — ideal for friends and colleagues travelling together.",
    longDescription:
      "The Deluxe Twin frames the Bhubaneswar skyline through generous windows and pairs it with two individually dressed beds. Warm neutral tones, tactile textures and a considered work nook make it as suited to a productive stay as a restful one.",
    priceFrom: 4200,
    size: "28 m²",
    occupancy: "2 Guests",
    bed: "Two Single Beds",
    view: "City View",
    image: img(IMAGES.deluxeTwin),
    gallery: [img(IMAGES.deluxeTwin), img(IMAGES.roomDetailDesk), img(IMAGES.roomDetailBath)],
    amenities: [...commonAmenities, "Work desk", "City-view windows"],
  },
  {
    slug: "deluxe-king",
    name: "Deluxe King",
    tagline: "Space to unwind, beautifully",
    description:
      "A generous king room with a serene palette and a spa-inspired bath — effortless comfort for leisure and business alike.",
    longDescription:
      "The Deluxe King is an exercise in calm. A plush king bed anchors the room, while soft lighting, natural materials and a modern bathroom create a retreat that feels a world away from the day outside.",
    priceFrom: 5200,
    size: "32 m²",
    occupancy: "2 Guests",
    bed: "King Bed",
    view: "Garden / City",
    image: img(IMAGES.deluxeKing),
    gallery: [img(IMAGES.deluxeKing), img(IMAGES.roomDetailBath), img(IMAGES.roomDetailDesk)],
    amenities: [...commonAmenities, "Spacious work desk", "Walk-in shower"],
  },
  {
    slug: "premium-king",
    name: "Premium King",
    tagline: "Enhanced comfort, elevated light",
    description:
      "Refined accommodation with a spacious layout, abundant natural light and sweeping city views through large windows.",
    longDescription:
      "The Premium King offers enhanced comfort for both leisure and corporate travellers. A plush king-size bed dressed in premium linen, a spacious work desk and a modern bathroom with a walk-in shower or bathtub come together beneath abundant natural light and city views.",
    priceFrom: 6400,
    size: "36 m²",
    occupancy: "2 Guests",
    bed: "King Bed",
    view: "City View",
    image: img(IMAGES.premiumKing),
    gallery: [img(IMAGES.premiumKing), img(IMAGES.roomDetailBath), img(IMAGES.roomDetailDesk)],
    amenities: [...commonAmenities, "Large city-view windows", "Walk-in shower or bathtub", "Spacious work desk"],
    featured: true,
  },
  {
    slug: "junior-suite",
    name: "Junior Suite",
    tagline: "A suite feeling, thoughtfully scaled",
    description:
      "An open-plan suite with a distinct lounge corner, premium furnishings and room to spread out and relax.",
    longDescription:
      "The Junior Suite introduces a defined living space to the comfort of our king rooms. Curl up in the reading corner, host a quiet conversation, or simply enjoy the extra room — every detail is chosen for a longer, more indulgent stay.",
    priceFrom: 8200,
    size: "44 m²",
    occupancy: "2–3 Guests",
    bed: "King Bed + Lounge",
    view: "City View",
    image: img(IMAGES.juniorSuite),
    gallery: [img(IMAGES.juniorSuite), img(IMAGES.roomDetailBath), img(IMAGES.deluxeKing)],
    amenities: [...commonAmenities, "Separate lounge area", "Rain shower", "Bathrobe & slippers"],
    featured: true,
  },
  {
    slug: "suite",
    name: "The Suite",
    tagline: "Our most expansive stay",
    description:
      "A grand suite with a full living room, premium amenities and panoramic views — the signature Park Selections experience.",
    longDescription:
      "Our flagship Suite is designed for those who want the very best. A separate living room, a sumptuous bedroom and a marble bath frame panoramic views of the city. Personalised service ensures every moment feels considered.",
    priceFrom: 11500,
    size: "62 m²",
    occupancy: "2–4 Guests",
    bed: "King Bed + Living Room",
    view: "Panoramic City View",
    image: img(IMAGES.suite),
    gallery: [img(IMAGES.suite), img(IMAGES.roomDetailBath), img(IMAGES.juniorSuite)],
    amenities: [
      ...commonAmenities,
      "Separate living room",
      "Marble bathroom",
      "Panoramic views",
      "Priority check-in",
    ],
    featured: true,
  },
];

export function getRoom(slug: string) {
  return ROOMS.find((room) => room.slug === slug);
}
