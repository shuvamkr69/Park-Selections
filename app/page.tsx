import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IMAGES, img } from "@/lib/images";
import { CONTENT } from "@/constants/content";
import { ROOMS } from "@/constants/rooms";
import { EVENTS } from "@/constants/events";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { RoomCard } from "@/components/ui/room-card";
import { EventCard } from "@/components/ui/event-card";
import { Reveal } from "@/components/animation/reveal";
import { Hero } from "@/components/sections/hero";
import { SplitFeature } from "@/components/sections/split-feature";
import { Stats } from "@/components/sections/stats";
import { AmenitiesGrid } from "@/components/sections/amenities-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { Gallery } from "@/components/sections/gallery";
import { CTA } from "@/components/sections/cta";
import { ServiceMarquee } from "@/components/interactive/service-marquee";

export default function HomePage() {
  const featuredRooms = ROOMS.filter((r) => r.featured);

  return (
    <div className="select-none">
      <Hero />

      <SplitFeature
        eyebrow={CONTENT.intro.eyebrow}
        title={CONTENT.intro.title}
        body={CONTENT.intro.body}
        image={img(IMAGES.aboutStory)}
        imageAlt="Warmly lit interior at Park Selections"
        secondaryImage={img(IMAGES.aboutDetail, 600)}
        bullets={[
          "Fine Dining",
          "Five refined room categories",
          "Celebrated event venues",
          "Heartfelt hospitality",
        ]}
        cta={{ label: "Discover Our Story", href: "/about" }}
      />

      <Stats />

      {/* Featured rooms */}
      <section className="bg-muted/40 py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Rooms & Suites"
              title="Rest, beautifully considered"
              description="Light-filled rooms and suites designed for deep rest and easy work."
              align="left"
            />
            <Reveal preset="fadeUp">
              <Link
                href="/rooms"
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                View all rooms
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <Reveal
            stagger
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featuredRooms.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Events preview */}
      <section className="bg-background py-20 md:py-28">
        <Container>
          <SectionHeader
            eyebrow="Weddings & Events"
            title="Where every celebration begins with feeling"
            description="Indoor and open-air venues for weddings, engagements, receptions and corporate gatherings."
          />
          <Reveal stagger className="mt-12 grid gap-6 md:grid-cols-2">
            {EVENTS.slice(0, 2).map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </Reveal>
          <div className="mt-8 flex justify-center">
            <Reveal preset="fadeUp">
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                Explore all venues
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Dining */}
      <SplitFeature
        reverse
        eyebrow="Namaskaram · Dining"
        title={["An expression of taste", "and refinement"]}
        body={[
          "Dining at Park Selections is a celebration of flavour, detail and thoughtful craftsmanship. Every dish is created with care, balancing technique, presentation and seasonality.",
          "Namaskaram, our signature restaurant, is opening soon - a space where refined cuisine meets the warmth of Odia hospitality.",
        ]}
        image={img(IMAGES.diningRestaurant)}
        imageAlt="Namaskaram restaurant interior"
        cta={{ label: "Discover Dining", href: "/dining" }}
      />

      <ServiceMarquee />
      {/* <AmenitiesGrid /> */}
      <Testimonials />
      <Gallery description="From light-filled rooms to celebrated venues - a look at the spaces that make a stay here unforgettable." />
      <CTA />
    </div>
  );
}
