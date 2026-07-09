import type { Metadata } from "next";
import { IMAGES, img } from "@/lib/images";
import { EVENTS } from "@/constants/events";
import { Container } from "@/components/ui/container";
import { EventCard } from "@/components/ui/event-card";
import { PageHero } from "@/components/sections/page-hero";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";

export const metadata: Metadata = {
  title: "Weddings & Events",
  description:
    "Host weddings, engagements, receptions and corporate meetings at Park Selections Bhubaneswar — elegant indoor and open-air venues.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Weddings & Events"
        title="Celebrations, beautifully hosted"
        description="Elegant indoor settings and open-air venues where moments become cherished memories."
        image={img(IMAGES.wedding, 2000)}
        imageAlt="A wedding celebration at Park Selections"
      />

      <section className="bg-background py-20 md:py-28">
        <Container>
          <Reveal stagger className="grid gap-6 md:grid-cols-2">
            {EVENTS.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </Reveal>
        </Container>
      </section>

      <CTA />
    </>
  );
}
