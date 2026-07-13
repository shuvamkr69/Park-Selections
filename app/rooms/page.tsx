import type { Metadata } from "next";
import { IMAGES, img } from "@/lib/images";
import { ROOMS } from "@/constants/rooms";
import { Container } from "@/components/ui/container";
import { RoomCard } from "@/components/ui/room-card";
import { PageHero } from "@/components/sections/page-hero";
import { AmenitiesGrid } from "@/components/sections/amenities-grid";
import { BookingShowcase } from "@/components/sections/booking-showcase";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Explore Park Selections' rooms and suites in Bhubaneswar - from Deluxe Twins to our signature Suite, each a light-filled retreat near KIIT.",
  alternates: { canonical: "/rooms" },
};

export default function RoomsPage() {
  return (
    <>
      <PageHero
        eyebrow="Rooms & Suites"
        title="Rest, beautifully considered"
        description="Five refined categories, each designed for deep rest and effortless work."
        image={img(IMAGES.suite, 2000)}
        imageAlt="A suite at Park Selections"
      />

      <section className="bg-background py-20 md:py-28">
        <Container>
          <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ROOMS.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </Reveal>
        </Container>
      </section>

      <BookingShowcase />
      <AmenitiesGrid />
      <CTA />
    </>
  );
}
