import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Maximize, BedDouble, Eye, Users, Phone } from "lucide-react";
import { ROOMS, getRoom } from "@/constants/rooms";
import { SITE } from "@/constants/site";
import { formatPhone } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/ui/room-card";
import { SectionHeader } from "@/components/ui/section-header";
import { PageHero } from "@/components/sections/page-hero";
import { CTA } from "@/components/sections/cta";
import { Reveal } from "@/components/animation/reveal";

export function generateStaticParams() {
  return ROOMS.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return { title: "Room Not Found" };
  return {
    title: `${room.name} — Rooms`,
    description: room.description,
    alternates: { canonical: `/rooms/${room.slug}` },
    openGraph: { title: `${room.name} · ${SITE.name}`, description: room.description },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const others = ROOMS.filter((r) => r.slug !== room.slug).slice(0, 3);
  const meta = [
    { icon: Maximize, label: "Size", value: room.size },
    { icon: Users, label: "Occupancy", value: room.occupancy },
    { icon: BedDouble, label: "Bed", value: room.bed },
    { icon: Eye, label: "View", value: room.view },
  ];

  return (
    <>
      <PageHero
        eyebrow={room.tagline}
        title={room.name}
        image={room.gallery[0]}
        imageAlt={room.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Rooms", href: "/rooms" },
          { label: room.name },
        ]}
      />

      <section className="bg-background py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            {/* Main content */}
            <div>
              <Reveal preset="fadeUp">
                <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                  About this room
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {room.longDescription}
                </p>
              </Reveal>

              {/* Meta strip */}
              <Reveal
                stagger
                className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
              >
                {meta.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-card p-4 text-center"
                  >
                    <Icon className="mx-auto size-5 text-accent" />
                    <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </Reveal>

              {/* Gallery */}
              <Reveal stagger className="mt-10 grid grid-cols-2 gap-4">
                {room.gallery.map((src, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-xl ${
                      i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${room.name} view ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </Reveal>

              {/* Amenities */}
              <div className="mt-12">
                <h3 className="font-serif text-2xl text-foreground">
                  Room amenities
                </h3>
                <Reveal
                  stagger
                  childSelector="li"
                  as="ul"
                  className="mt-6 grid gap-3 sm:grid-cols-2"
                >
                  {room.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2.5 text-sm text-foreground"
                    >
                      <Check className="size-4 shrink-0 text-accent" />
                      {a}
                    </li>
                  ))}
                </Reveal>
              </div>
            </div>

            {/* Booking card */}
            <aside className="lg:pl-4">
              <div className="sticky top-28 rounded-2xl border border-border bg-card p-7 shadow-card">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="mt-1 font-serif text-4xl text-foreground">
                  ₹{room.priceFrom.toLocaleString("en-IN")}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / night
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Taxes & fees calculated at reservation.
                </p>

                <div className="mt-6 space-y-3 border-y border-border py-6">
                  {meta.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Icon className="size-4 text-accent" /> {label}
                      </span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>

                <Button href="/contact" size="lg" className="mt-6 w-full">
                  Reserve This Room
                </Button>
                <a
                  href={`tel:${SITE.contact.phone}`}
                  className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
                >
                  <Phone className="size-4 text-accent" />
                  {formatPhone(SITE.contact.phone)}
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Other rooms */}
      <section className="bg-muted/40 py-20 md:py-28">
        <Container>
          <SectionHeader eyebrow="Keep Exploring" title="Other rooms & suites" />
          <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => (
              <RoomCard key={r.slug} room={r} />
            ))}
          </Reveal>
        </Container>
      </section>

      <CTA />
    </>
  );
}
