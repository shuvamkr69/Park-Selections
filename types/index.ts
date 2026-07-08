import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
};

export type Room = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  priceFrom: number;
  size: string;
  occupancy: string;
  bed: string;
  view: string;
  image: string;
  gallery: string[];
  amenities: string[];
  featured?: boolean;
};

export type EventVenue = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  longDescription: string;
  capacity: string;
  image: string;
  gallery: string[];
  highlights: string[];
};

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Amenity = {
  title: string;
  icon: LucideIcon;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  rating: number;
};

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

export type Award = {
  title: string;
  organization: string;
  year: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};
