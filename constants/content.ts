import type { Award, FaqItem, Stat } from "@/types";

/** Shared, reusable copy used across multiple pages. */
export const CONTENT = {
  hero: {
    eyebrow: "Bhubaneswar",
    title: ["A Stay That Stays", "In Your Heart"],
    subtitle:
      "A luxury retreat where refined rooms, celebrated venues and heartfelt hospitality come together - in the heart of Bhubaneswar.",
    primaryCta: { label: "Book Your Stay", href: "/contact" },
    secondaryCta: { label: "Explore Rooms", href: "/rooms" },
  },

  intro: {
    eyebrow: "Welcome to Park Selections",
    title: "Where every stay feels like it belongs",
    body: "We aim to provide an exceptional stay with unparalleled comfort and beauty, ensuring every guest feels valued and cherished. Set in the heart of Bhubaneswar, Park Selections blends modern luxury with the warmth of hospitality.",
  },

  about: {
    eyebrow: "Our Story",
    title: "A modern sanctuary, rooted in warmth",
    body: [
      "Park Selections was created with a single belief: that a great stay is felt, not just seen. Every space - from our light-filled rooms to our celebrated event venues - is designed to make you feel valued and cherished.",
      "Moments from Bhubaneswar's cultural corridor, we bring together contemporary design, considered service and the timeless warmth of hospitality. Whether you are here to work, to celebrate, or simply to rest, you will find a stay that stays in your heart.",
    ],
    commitment:
      "We aim to provide an exceptional stay with unparalleled comfort and beauty, ensuring every guest feels valued and cherished.",
  },

  stats: [
    { value: 5, label: "Room Categories" },
    { value: 500, suffix: "+", label: "Event Capacity" },
    { value: 4, label: "Star Experience" },
    { value: 24, suffix: "/7", label: "Concierge Care" },
  ] satisfies Stat[],

  awards: [
    {
      title: "Four-Star Rating",
      organization: "Luxury Travel Association",
      year: "2023",
    },
    {
      title: "Best New Hotel",
      organization: "Hospitality Excellence Awards",
      year: "2021",
    },
    {
      title: "Wellness Award",
      organization: "Sustainable Environment Council",
      year: "2022",
    },
  ] satisfies Award[],

  cta: {
    eyebrow: "Reserve Your Escape",
    title: "Your finest stay in Bhubaneswar awaits",
    body: "Speak with our reservations team to plan your stay, celebration or corporate gathering.",
    primary: { label: "Book Your Stay", href: "/contact" },
    secondary: { label: "Call Us", href: "/contact" },
  },

  faqs: [
    {
      question: "Where is Park Selections located?",
      answer:
        "We are on Plot No. 100, KIIT Road, near Falcon Marine Exports, Chandaka Industrial Estate, Patia, Bhubaneswar - moments from KIIT University and the city's tech corridor.",
    },
    {
      question: "What are the check-in and check-out times?",
      answer:
        "Standard check-in is from 2:00 PM and check-out is by 12:00 PM. Early check-in and late check-out can be arranged on request, subject to availability.",
    },
    {
      question: "Do you host weddings and corporate events?",
      answer:
        "Yes. We offer indoor and open-air venues for weddings, engagements, receptions and corporate meetings, with dedicated event coordination and catering.",
    },
    {
      question: "Is dining available at the hotel?",
      answer:
        "Namaskaram, our in-house restaurant, offers refined, seasonal cuisine crafted with care. In-room dining is available around the clock.",
    },
    {
      question: "How do I make a reservation?",
      answer:
        "You can reserve by calling our team, emailing reservations@parkselections.com, or using the contact form on this site. We respond promptly to every enquiry.",
    },
  ] satisfies FaqItem[],
} as const;
