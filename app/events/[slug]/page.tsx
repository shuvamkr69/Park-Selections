import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Users, Sparkles } from "lucide-react";
import { EVENTS, getEvent } from "@/constants/events";
import { SITE } from "@/constants/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/ui/event-card";
import { SectionHeader } from "@/components/ui/section-header";
import { PageHero } from "@/components/sections/page-hero";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.name} — Events`,
    description: event.description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: { title: `${event.name} · ${SITE.name}`, description: event.description },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const others = EVENTS.filter((e) => e.slug !== event.slug);

  return (
    <>
      <PageHero
        eyebrow={event.category}
        title={event.name}
        description={event.tagline}
        image={event.gallery[0]}
        imageAlt={event.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.name },
        ]}
      />

      <section className="bg-background py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div>
              <Reveal preset="fadeUp">
                <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                  {event.tagline}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {event.longDescription}
                </p>
              </Reveal>

              <Reveal stagger className="mt-10 grid grid-cols-2 gap-4">
                {event.gallery.map((src, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-xl ${
                      i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${event.name} ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </Reveal>
            </div>

            <aside>
              <div className="sticky top-28 rounded-2xl border border-border bg-card p-7 shadow-card">
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                  <Users className="size-4 text-accent" /> {event.capacity}
                </span>
                <h3 className="mt-5 font-serif text-2xl text-foreground">
                  What we offer
                </h3>
                <ul className="mt-5 space-y-3">
                  {event.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Button href="/contact" size="lg" className="mt-7 w-full">
                  Plan Your Event
                </Button>
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                  <Sparkles className="size-3.5 text-accent" />
                  Dedicated event coordination included
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-muted/40 py-20 md:py-28">
        <Container>
          <SectionHeader eyebrow="More Occasions" title="Other celebrations" />
          <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </Reveal>
        </Container>
      </section>

      <CTA />
    </>
  );
}
