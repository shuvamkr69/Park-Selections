"use client";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";

/**
 * Offerings showcase built on the Aceternity 3D Marquee. The image set is
 * drawn from the marquee folder (`public/images/marquee/`) for a curated
 * visual flow.
 */

// Marquee images sourced from public/images/marquee/
const MARQUEE_IMAGES = [
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r.png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (1).png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (2).png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (3).png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (4).png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (5).png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (6).png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (7).png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (8).png",
  "/images/marquee/Gemini_Generated_Image_aq5rq2aq5rq2aq5r (9).png",
];

// Repeat to fill 32 images for the full marquee
const images = [
  ...MARQUEE_IMAGES,
  ...MARQUEE_IMAGES,
  ...MARQUEE_IMAGES,
  ...MARQUEE_IMAGES.slice(0, 2),
];

export function ServiceMarquee() {
  return (
    <section
      aria-label="Our offerings"
      className="overflow-hidden border-y border-primary-foreground/10 bg-primary py-16 md:py-24"
    >
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center text-accent">
            Everything under one roof
          </span>
          <h2 className="mt-4 font-serif text-3xl text-primary-foreground md:text-5xl">
            A world of refined experiences
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/70">
            Rooms and suites, celebrated venues, wellness and fine dining —
            explored in a single glance.
          </p>
        </div>

        <div className="relative mt-12 rounded-3xl bg-background/90 p-2 ring-1 ring-primary-foreground/10">
          <ThreeDMarquee images={images} />

          {/* Edge fades so the tilted grid melts into the section background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 rounded-t-3xl bg-gradient-to-b from-primary to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 rounded-b-3xl bg-gradient-to-t from-primary to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
