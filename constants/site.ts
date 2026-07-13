import {
  InstagramIcon,
  FacebookIcon,
  XTwitterIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import type { NavItem, SocialLink } from "@/types";

export const SITE = {
  name: "Park Selections",
  legalName: "Park Selections Hotel",
  tagline: "A Stay That Stays In Your Heart",
  shortDescription:
    "A luxury hotel in Bhubaneswar near KIIT — refined rooms, celebrated venues, and heartfelt hospitality.",
  seoTitle: "Park Selections — Luxury Hotel in Bhubaneswar near KIIT",
  seoDescription:
    "Park Selections is a premium luxury hotel in Bhubaneswar, Odisha, near KIIT. Elegant rooms and suites, wedding & event venues, and fine dining at Namaskaram.",
  url: "https://www.parkselections.com",
  locale: "en_IN",

  contact: {
    phone: "+919777650375",
    phoneAlt: "+919777650357",
    email: "reservations@parkselections.com",
    bookingUrl:
      "https://booking.parkselections.com/inst/#/home?propertyId=622NTLuT66M0Wvw3VvmEDJzhwz4F2ffvPYoxc0MzU=&JDRN=Y&RoomID=242632,242633,242634,242635,242636&ap=1&gsId=622NTLuT66M0Wvw3VvmEDJzhwz4F2ffvPYoxc0MzU=",
    address: {
      line1: "Plot No. 100, KIIT Road",
      line2: "Near Falcon Marine Exports, Chandaka Industrial Estate",
      city: "Patia, Bhubaneswar",
      state: "Odisha",
      postalCode: "751024",
      country: "India",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Park+Selections+KIIT+Road+Bhubaneswar",
    },
  },
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Events", href: "/events" },
  { label: "Dining", href: "/dining" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Twitter", href: "https://twitter.com", icon: XTwitterIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
];

export const FOOTER_LINKS: { title: string; links: NavItem[] }[] = [
  {
    title: "Stay",
    links: [
      { label: "Rooms & Suites", href: "/rooms" },
      { label: "Dining", href: "/dining" },
      { label: "Offers", href: "/rooms" },
      { label: "Book a Stay", href: "/contact" },
    ],
  },
  {
    title: "Celebrate",
    links: [
      { label: "Weddings", href: "/events/wedding" },
      { label: "Engagements", href: "/events/engagement" },
      { label: "Receptions", href: "/events/reception" },
      { label: "Corporate Meetings", href: "/events/corporate-meetings" },
    ],
  },
  {
    title: "Hotel",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Gallery", href: "/about#gallery" },
      { label: "Contact", href: "/contact" },
      { label: "Location", href: "/contact#location" },
    ],
  },
];
