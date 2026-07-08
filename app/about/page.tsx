import type { Metadata } from "next";
import { Award } from "lucide-react";
import { IMAGES, img } from "@/lib/images";
import { CONTENT } from "@/constants/content";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { PageHero } from "@/components/sections/page-hero";
import { SplitFeature } from "@/components/sections/split-feature";
import { Stats } from "@/components/sections/stats";
import { Gallery } from "@/components/sections/gallery";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story of Park Selections — a modern luxury hotel in Bhubaneswar near KIIT, blending contemporary design with the warmth of Odia hospitality.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={CONTENT.about.eyebrow}
        title="A stay that stays in your heart"
        description="Modern luxury, rooted in the warmth of Odia hospitality — moments from KIIT in the heart of Bhubaneswar."
        image={img(IMAGES.heroLobby, 2000)}
        imageAlt="The lobby lounge at Park Selections"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <SplitFeature
        eyebrow={CONTENT.about.eyebrow}
        title={CONTENT.about.title}
        body={[...CONTENT.about.body]}
        image={img(IMAGES.aboutStory)}
        imageAlt="Interior detail at Park Selections"
        secondaryImage={img(IMAGES.aboutDetail, 600)}
      />

      {/* Commitment banner */}
      <section className="bg-muted/50 py-20 md:py-28">
        <Container className="max-w-4xl text-center">
          <Reveal preset="fadeIn">
            <span className="eyebrow mx-auto justify-center">
              <span className="h-px w-8 bg-accent" aria-hidden />
              Our Commitment
              <span className="h-px w-8 bg-accent" aria-hidden />
            </span>
          </Reveal>
          <Reveal preset="fadeUp" delay={0.1}>
            <p className="mt-6 font-serif text-2xl leading-snug text-foreground md:text-4xl md:leading-tight">
              “{CONTENT.about.commitment}”
            </p>
          </Reveal>
        </Container>
      </section>

      <Stats />

      {/* Awards */}
      <section className="bg-background py-20 md:py-28">
        <Container>
          <SectionHeader
            eyebrow="Recognition"
            title="Celebrated for the experience we create"
            description="Honoured by those who know hospitality best."
          />
          <Reveal
            stagger
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CONTENT.awards.map((award) => (
              <div
                key={award.title}
                className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-soft"
              >
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-accent">
                  <Award className="size-6" />
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground">
                    {award.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {award.organization}
                  </p>
                  <p className="mt-3 text-xs font-medium tracking-[0.2em] text-accent">
                    {award.year}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <Gallery />
      <CTA />
    </>
  );
}
