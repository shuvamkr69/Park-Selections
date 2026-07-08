import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import type { EventVenue } from "@/types";
import { cn } from "@/lib/utils";

export function EventCard({
  event,
  className,
}: {
  event: EventVenue;
  className?: string;
}) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl p-7 text-white shadow-soft transition-shadow duration-500 hover:shadow-card",
        className,
      )}
    >
      <Image
        src={event.image}
        alt={event.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />

      <div className="relative z-10">
        <span className="eyebrow text-accent">{event.category}</span>
        <h3 className="mt-2 font-serif text-3xl">{event.name}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
          {event.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs text-white/75">
            <Users className="size-4 text-accent" /> {event.capacity}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white transition-transform duration-300 group-hover:translate-x-1">
            Explore <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
