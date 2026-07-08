import type { Metadata } from "next";
import { Leaf, Utensils, Palette } from "lucide-react";
import { IMAGES, img } from "@/lib/images";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { PageHero } from "@/components/sections/page-hero";
import { SplitFeature } from "@/components/sections/split-feature";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";

export const metadata: Metadata = {
  title: "Dining · Namaskaram",
  description:
    "Namaskaram at Park Selections — an expression of taste and refinement. Refined, seasonal cuisine crafted with care, opening soon in Bhubaneswar.",
  alternates: { canonical: "/dining" },
};

const PILLARS = [
  {
    icon: Utensils,
    title: "Flavour",
    body: "Dishes built around bold, balanced flavour and the finest seasonal produce.",
  },
  {
    icon: Palette,
    title: "Detail",
    body: "Considered presentation and technique in every plate that leaves our kitchen.",
  },
  {
    icon: Leaf,
    title: "Craftsmanship",
    body: "Thoughtful, seasonal craftsmanship that honours ingredient and place.",
  },
];

export default function DiningPage() {
  return (
    <>
      <PageHero
        eyebrow="Namaskaram · Opening Soon"
        title="An expression of taste"
        description="Dining at Park Selections is a celebration of flavour, detail and thoughtful craftsmanship."
        image={img(IMAGES.diningRestaurant, 2000)}
        imageAlt="Namaskaram restaurant at Park Selections"
        crumbs={[{ label: "Home", href: "/" }, { label: "Dining" }]}
      />

      <SplitFeature
        eyebrow="The Namaskaram Experience"
        title={["Refined cuisine,", "warmly served"]}
        body={[
          "Namaskaram is our expression of taste and refinement — a space where every dish is created with care, balancing technique, presentation and seasonality.",
          "Rooted in the warmth of Odia hospitality and elevated by contemporary craft, our restaurant is opening soon. We can't wait to welcome you to the table.",
        ]}
        image={img(IMAGES.diningPlating)}
        imageAlt="An artfully plated dish"
        secondaryImage={img(IMAGES.diningDish, 600)}
      />

      {/* Pillars */}
      <section className="bg-muted/40 py-20 md:py-28">
        <Container>
          <SectionHeader
            eyebrow="Our Philosophy"
            title="Every dish, created with care"
          />
          <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft"
              >
                <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-primary text-accent">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-serif text-2xl text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <CTA />
    </>
  );
}
