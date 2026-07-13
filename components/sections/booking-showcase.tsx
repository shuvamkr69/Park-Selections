import Image from "next/image";
import { ArrowUpRight, Maximize, Users, Eye, Check } from "lucide-react";
import { BOOKING_ROOMS, BOOKING_URL, roomBookingUrl } from "@/constants/booking";
import { Container } from "@/components/ui/container";
import { GlassButton } from "@/components/ui/glass-button";
import { Reveal } from "@/components/animation/reveal";
import { TextReveal } from "@/components/animation/text-reveal";

/**
 * Direct-booking showcase — a premium funnel to the hotel's official booking
 * engine. Each row mirrors the live booking platform's room data (official
 * photography, capacity, amenities) and deep-links its category on the
 * engine; the engine itself is never replicated here.
 */
export function BookingShowcase() {
  return (
    <section
      aria-label="Book your stay directly"
      className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-28"
    >
      {/* Soft gold glow anchored to the top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-20"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, var(--accent), transparent 70%)",
        }}
      />

      <Container className="relative">
        {/* Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal preset="fadeIn">
              <span className="eyebrow text-accent">
                <span className="h-px w-8 bg-accent" aria-hidden />
                Book Direct · Official Rates
              </span>
            </Reveal>
            <TextReveal
              as="h2"
              text={["Reserve your stay,", "directly with us"]}
              className="mt-4 text-3xl text-primary-foreground sm:text-4xl md:text-5xl"
            />
          </div>
          <Reveal preset="fadeUp" delay={0.15}>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/70 md:text-right">
              Live availability and rates on our official booking platform —
              secure, instant confirmation.
            </p>
          </Reveal>
        </div>

        {/* Room rows */}
        <Reveal
          stagger
          childSelector="[data-booking-room]"
          className="mt-14 border-t border-primary-foreground/15"
        >
          {BOOKING_ROOMS.map((room) => (
            <article
              key={room.roomId}
              data-booking-room
              className="group grid items-center gap-6 border-b border-primary-foreground/15 py-8 md:py-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)_auto] lg:gap-10"
            >
              {/* Image */}
              <a
                href={roomBookingUrl(room.roomId)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Book the ${room.name} on our official booking platform`}
                className="relative block overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 19rem"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute bottom-4 right-4 inline-flex size-9 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </a>

              {/* Details */}
              <div>
                <h3 className="font-serif text-2xl text-primary-foreground md:text-3xl">
                  {room.name}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/70">
                  {room.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-primary-foreground/75">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5 text-accent" /> {room.guests}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Maximize className="size-3.5 text-accent" /> {room.size}
                  </span>
                  {room.view && (
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="size-3.5 text-accent" /> {room.view}
                    </span>
                  )}
                </div>

                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                  {room.amenities.map((a) => (
                    <li
                      key={a}
                      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-primary-foreground/60"
                    >
                      <Check className="size-3 text-accent" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="lg:justify-self-end">
                <GlassButton
                  href={roomBookingUrl(room.roomId)}
                  target="_blank"
                  size="md"
                  aria-label={`Book the ${room.name} now`}
                >
                  Book Now
                </GlassButton>
              </div>
            </article>
          ))}
        </Reveal>

        {/* Full-engine link */}
        <Reveal preset="fadeUp" delay={0.1}>
          <div className="mt-10 flex justify-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/all inline-flex items-center gap-2 text-sm font-medium text-primary-foreground"
            >
              <span className="relative">
                View all rates &amp; availability
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover/all:scale-x-100"
                />
              </span>
              <ArrowUpRight className="size-4 text-accent transition-transform duration-300 group-hover/all:-translate-y-0.5 group-hover/all:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
