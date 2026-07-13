import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, Utensils, Palette } from "lucide-react";
import { IMAGES, img } from "@/lib/images";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ImmersiveBanner } from "@/components/sections/immersive-banner";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";
import { TextReveal } from "@/components/animation/text-reveal";
import { Parallax } from "@/components/animation/parallax";

export const metadata: Metadata = {
  title: "Dining · Namaskaram",
  description:
    "Namaskaram at Park Selections - an expression of taste and refinement. Refined, seasonal cuisine crafted with care, opening soon in Bhubaneswar.",
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
      />

      {/* ── The Namaskaram experience - editorial split ──────────────── */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        {/* Ghost wordmark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 top-8 select-none whitespace-nowrap font-serif text-[6rem] leading-none text-foreground/[0.03] md:text-[11rem]"
        >
          Namaskaram
        </span>

        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
            {/* Media composition */}
            <Reveal preset="slideRight" className="relative lg:col-span-6">
              <div
                aria-hidden="true"
                className="absolute -left-5 -top-5 h-40 w-40 rounded-tl-2xl border-l border-t border-accent/40"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card sm:aspect-[5/4] lg:aspect-[4/5]">
                <Parallax
                  speed={8}
                  className="absolute -inset-y-[10%] inset-x-0"
                >
                  <Image
                    src={img(IMAGES.diningPlating)}
                    alt="An artfully plated dish at Namaskaram"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
              <div className="absolute -bottom-10 -right-4 hidden aspect-square w-44 overflow-hidden rounded-xl border-4 border-background shadow-lift sm:block lg:w-56">
                <Image
                  src={img(IMAGES.diningDish, 600)}
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
                  The Namaskaram Experience
                </span>
              </Reveal>
              <TextReveal
                as="h2"
                text={["Refined cuisine,", "warmly served"]}
                className="mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl"
              />
              <Reveal preset="fadeUp" delay={0.1}>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Namaskaram is our expression of taste and refinement - a
                    space where every dish is created with care, balancing
                    technique, presentation and seasonality.
                  </p>
                  <p>
                    Rooted in the warmth of Odia hospitality and elevated by
                    contemporary craft, our restaurant is opening soon. We
                    can&rsquo;t wait to welcome you to the table.
                  </p>
                </div>
              </Reveal>
              <Reveal preset="fadeUp" delay={0.2}>
                <span className="mt-9 inline-flex items-center gap-3 rounded-full border border-accent/40 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
                  <span
                    className="size-1.5 rounded-full bg-accent"
                    aria-hidden
                  />
                  Opening Soon
                </span>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <ImmersiveBanner
        eyebrow="Our Philosophy"
        statement={["Every dish,", "created with care"]}
        image={img(IMAGES.diningDish, 2000)}
        imageAlt="A dish in preparation at Namaskaram"
      />

      {/* ── Pillars - numbered editorial columns ─────────────────────── */}
      <section className="bg-background py-20 md:py-28">
        <Container>
          <Reveal stagger className="grid gap-y-14 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="group px-2 text-center md:border-l md:border-border/70 md:px-10 md:text-left md:first:border-l-0 md:first:pl-0"
              >
                <span className="text-xs font-medium tracking-[0.3em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mx-auto mt-6 flex size-14 items-center justify-center rounded-full border border-border text-accent transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground md:mx-0">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 font-serif text-2xl text-foreground">
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
