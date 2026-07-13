import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { IMAGES, img } from "@/lib/images";
import { EVENTS } from "@/constants/events";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ImmersiveBanner } from "@/components/sections/immersive-banner";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";
import { TextReveal } from "@/components/animation/text-reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Weddings & Events",
  description:
    "Host weddings, engagements, receptions and corporate meetings at Park Selections Bhubaneswar - elegant indoor and open-air venues.",
  alternates: { canonical: "/events" },
};

const INTRO_STATS = [
  { value: String(EVENTS.length).padStart(2, "0"), label: "Distinct venues" },
  { value: "500+", label: "Guest capacity" },
  { value: "On-site", label: "Event coordination" },
];

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

      {/* ── Editorial intro ─────────────────────────────────────────── */}
      <section className="bg-background pt-20 md:pt-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal preset="fadeIn">
                <span className="eyebrow">
                  <span className="h-px w-8 bg-accent" aria-hidden />
                  The Venues
                </span>
              </Reveal>
              <TextReveal
                as="h2"
                text={["Where every celebration", "begins with feeling"]}
                className="mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl"
              />
            </div>
            <Reveal
              stagger
              className="grid grid-cols-3 gap-6 self-end lg:col-span-6 lg:gap-10"
            >
              {INTRO_STATS.map((stat) => (
                <div key={stat.label} className="border-t border-border pt-5">
                  <p className="font-serif text-2xl text-foreground md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Venue showcase - alternating editorial rows ──────────────── */}
      <section className="bg-background pb-20 pt-6 md:pb-28">
        <Container>
          {EVENTS.map((event, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={event.slug}
                className="grid items-center gap-10 border-t border-border/60 py-16 first:border-t-0 md:py-20 lg:grid-cols-12 lg:gap-14"
              >
                {/* Media */}
                <Reveal
                  preset={flipped ? "slideLeft" : "slideRight"}
                  className={cn("lg:col-span-7", flipped && "lg:order-2")}
                >
                  <Link
                    href={`/events/${event.slug}`}
                    aria-label={`Explore ${event.name}`}
                    className="group relative block overflow-hidden rounded-2xl shadow-card"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={event.image}
                        alt={event.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                      <span className="glass absolute left-5 top-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-foreground">
                        <Users className="size-3.5 text-accent" />
                        {event.capacity}
                      </span>
                      <span className="absolute bottom-5 right-5 inline-flex size-11 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>

                {/* Content */}
                <div
                  className={cn(
                    "relative lg:col-span-5",
                    flipped && "lg:order-1",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-2 -top-12 select-none font-serif text-8xl leading-none text-foreground/[0.05] md:text-9xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <Reveal preset="fadeIn">
                    <span className="eyebrow">
                      <span className="h-px w-8 bg-accent" aria-hidden />
                      {event.category}
                    </span>
                  </Reveal>
                  <TextReveal
                    as="h2"
                    text={event.name}
                    className="mt-3 text-3xl text-foreground sm:text-4xl"
                  />
                  <Reveal preset="fadeUp" delay={0.08}>
                    <p className="mt-3 font-serif text-lg italic text-accent">
                      {event.tagline}
                    </p>
                  </Reveal>
                  <Reveal preset="fadeUp" delay={0.12}>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  </Reveal>

                  <Reveal
                    stagger
                    childSelector="li"
                    as="ul"
                    className="mt-7 space-y-2.5"
                  >
                    {event.highlights.slice(0, 3).map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-3 text-[13px] uppercase tracking-[0.12em] text-foreground/80"
                      >
                        <span
                          className="h-px w-6 shrink-0 bg-accent"
                          aria-hidden
                        />
                        {h}
                      </li>
                    ))}
                  </Reveal>

                  <Reveal preset="fadeUp" delay={0.2}>
                    <Link
                      href={`/events/${event.slug}`}
                      className="group/link mt-9 inline-flex items-center gap-2 text-sm font-medium text-foreground"
                    >
                      <span className="relative">
                        Explore {event.name}
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover/link:scale-x-100"
                        />
                      </span>
                      <ArrowUpRight className="size-4 text-accent transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </Container>
      </section>

      <ImmersiveBanner
        eyebrow="The Experience"
        statement={["Where moments become", "cherished memories"]}
        image={img(IMAGES.eventHall, 2000)}
        imageAlt="An elegantly set event hall at Park Selections"
      />

      <CTA />
    </>
  );
}
