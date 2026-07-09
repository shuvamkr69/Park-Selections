import type { Metadata } from "next";
import { IMAGES, img } from "@/lib/images";
import { CONTENT } from "@/constants/content";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { FAQ } from "@/components/sections/faq";
import { Reveal } from "@/components/animation/reveal";
import { LeafletMapLoader } from "@/components/interactive/leaflet-map-loader";

export const metadata: Metadata = {
  title: "Contact & Reservations",
  description:
    "Contact Park Selections Bhubaneswar for reservations, weddings and events. Call +91 97776 50375 or email reservations@parkselections.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & Reservations"
        title="We'd love to host you"
        description="Reach out to plan your stay, celebration or corporate gathering — our team responds promptly."
        image={img(IMAGES.heroLobby, 2000)}
        imageAlt="Park Selections reception"
      />

      {/* ── Full-section interactive map with form overlay ──────────────────── */}
      <section
        id="location"
        className="relative scroll-mt-24 overflow-hidden"
        aria-label="Location map and enquiry form"
      >
        {/* Leaflet map fills the entire section */}
        <LeafletMapLoader />

        {/* Subtle scrim for panel legibility without obscuring the map */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-background/20"
        />

        {/* Content layer — form floats on the right; left stays open for the pin */}
        <div className="relative z-[2] py-16 md:py-24">
          <Container>
            <div className="grid lg:grid-cols-2 lg:gap-12">
              {/* Left column intentionally empty — map + hotel pin visible here */}
              <div />

              {/* Enquiry form */}
              <Reveal preset="fadeUp">
                <ContactForm />
              </Reveal>
            </div>
          </Container>
        </div>
      </section>

      <FAQ items={[...CONTENT.faqs]} />
    </>
  );
}
