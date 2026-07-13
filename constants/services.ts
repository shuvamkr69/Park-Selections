import {
  BedDouble,
  Utensils,
  PartyPopper,
  Dumbbell,
  Sparkles,
  Wifi,
  Car,
  ConciergeBell,
  Wine,
  Coffee,
  ShieldCheck,
  Clock,
  Heart,
  Gem,
  Presentation,
} from "lucide-react";
import type { Amenity, Service } from "@/types";

/** Top-level offerings surfaced on the home page. */
export const SERVICES: Service[] = [
  {
    title: "Rooms & Suites",
    description:
      "Five refined room categories, from Deluxe Twins to our signature Suite - each a calm retreat.",
    icon: BedDouble,
  },
  {
    title: "Namaskaram Dining",
    description:
      "An expression of taste and refinement, where every dish is crafted with care and seasonality.",
    icon: Utensils,
  },
  {
    title: "Weddings & Events",
    description:
      "Indoor and open-air venues for weddings, engagements, receptions and corporate gatherings.",
    icon: PartyPopper,
  },
  {
    title: "Wellness & Leisure",
    description:
      "Thoughtful spaces to move, unwind and restore - designed around your wellbeing.",
    icon: Sparkles,
  },
];

/** Amenities grid. */
export const AMENITIES: Amenity[] = [
  { title: "High-speed Wi-Fi", icon: Wifi },
  { title: "Fine Dining", icon: Utensils },
  { title: "Fitness Centre", icon: Dumbbell },
  { title: "Spa & Wellness", icon: Sparkles },
  { title: "Valet Parking", icon: Car },
  { title: "24/7 Concierge", icon: ConciergeBell },
  { title: "Bar & Lounge", icon: Wine },
  { title: "In-room Coffee", icon: Coffee },
  { title: "Secure Premises", icon: ShieldCheck },
  { title: "Round-the-clock Service", icon: Clock },
];

/** Offerings shown in the scrolling marquee strips. */
export const MARQUEE_ITEMS: Amenity[] = [
  { title: "Rooms & Suites", icon: BedDouble },
  { title: "Luxury Stay", icon: Gem },
  { title: "Banquet Hall", icon: PartyPopper },
  { title: "Weddings", icon: Heart },
  { title: "Conferences", icon: Presentation },
  { title: "Fine Dining", icon: Utensils },
  { title: "Events", icon: Sparkles },
  { title: "Valet Parking", icon: Car },
  { title: "High-speed Wi-Fi", icon: Wifi },
  { title: "Spa & Wellness", icon: Dumbbell },
  { title: "Concierge", icon: ConciergeBell },
  { title: "Bar & Lounge", icon: Wine },
];
