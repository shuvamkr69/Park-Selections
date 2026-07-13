import type { Metadata } from "next";
import Image from "next/image";
import { Award } from "lucide-react";
import { IMAGES, img } from "@/lib/images";
import { CONTENT } from "@/constants/content";
import { SITE } from "@/constants/site";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { PageHero } from "@/components/sections/page-hero";
import { ImmersiveBanner } from "@/components/sections/immersive-banner";
import { Stats } from "@/components/sections/stats";
import { Gallery } from "@/components/sections/gallery";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";
import { TextReveal } from "@/components/animation/text-reveal";
import { Parallax } from "@/components/animation/parallax";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story of Park Selections - a modern luxury hotel in Bhubaneswar near KIIT, blending contemporary design with the warmth of Odia hospitality.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={CONTENT.about.eyebrow}
        title="A stay that stays in your heart"
        description="Modern luxury, rooted in the warmth of Odia hospitality - in the heart of Bhubaneswar."
        image={img(IMAGES.heroLobby, 2000)}
        imageAlt="The lobby lounge at Park Selections"
      />

      {/* ── Our story - editorial split ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
            {/* Media composition */}
            <Reveal preset="slideRight" className="relative lg:col-span-6">
              <div
                aria-hidden="true"
                className="absolute -right-5 -top-5 h-40 w-40 rounded-tr-2xl border-r border-t border-accent/40"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card sm:aspect-[5/4] lg:aspect-[4/5]">
                <Parallax
                  speed={8}
                  className="absolute -inset-y-[10%] inset-x-0"
                >
                  <Image
                    src={img(IMAGES.aboutStory)}
                    alt="Interior detail at Park Selections"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
              <div className="absolute -bottom-10 -left-6 hidden aspect-square w-44 overflow-hidden rounded-xl border-4 border-background shadow-lift sm:block lg:w-56">
                <Image
                  src={img(IMAGES.aboutDetail, 600)}
                  alt=""
                  fill
                  sizes="14rem"
                  className="object-cover"
                />
              </div>
            </Reveal>

            {/* Copy */}
            <div className="lg:col-span-6">
              <Reveal preset="fadeIn">
                <span className="eyebrow">
                  <span className="h-px w-8 bg-accent" aria-hidden />
                  {CONTENT.about.eyebrow}
                </span>
              </Reveal>
              <TextReveal
                as="h2"
                text={CONTENT.about.title}
                className="mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl"
              />
              <Reveal preset="fadeUp" delay={0.1}>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {CONTENT.about.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>
              <Reveal preset="fadeUp" delay={0.2}>
                <div className="mt-9 flex items-center gap-4">
                  <span className="h-px w-10 bg-accent" aria-hidden />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    {SITE.tagline}
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Commitment - immersive full-width statement ──────────────── */}
      <ImmersiveBanner
        eyebrow="Our Commitment"
        statement={`“${CONTENT.about.commitment}”`}
        statementAs="p"
        image={img(IMAGES.gardenCity, 2000)}
        imageAlt="The grounds at Park Selections"
      />

      <Stats />

      {/* ── Recognition - editorial award list ───────────────────────── */}
      <section className="bg-background py-20 md:py-28">
        <Container>
          <SectionHeader
            eyebrow="Recognition"
            title="Celebrated for the experience we create"
            description="Honoured by those who know hospitality best."
            align="left"
          />
          <Reveal
            stagger
            childSelector="[data-award]"
            className="mt-14 border-t border-border"
          >
            {CONTENT.awards.map((award) => (
              <div
                key={award.title}
                data-award
                className="group grid items-center gap-2 border-b border-border py-7 sm:grid-cols-[7rem_1fr_auto] sm:gap-8 md:py-9"
              >
                <span className="font-serif text-2xl text-accent md:text-3xl">
                  {award.year}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                    {award.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {award.organization}
                  </p>
                </div>
                <Award
                  className="hidden size-6 justify-self-end text-border transition-colors duration-300 group-hover:text-accent sm:block"
                  aria-hidden="true"
                />
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
