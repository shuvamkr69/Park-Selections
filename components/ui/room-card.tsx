"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Maximize, BedDouble, Eye } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import type { Room } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Room card built on the Aceternity 3D Card. The card tilts toward the cursor
 * and the inner layers lift on the Z axis. All room data and the link-through
 * to the detail page are preserved from the original card.
 */
export function RoomCard({ room, className }: { room: Room; className?: string }) {
  return (
    <CardContainer
      containerClassName={cn("py-0 w-full", className)}
      className="w-full"
    >
      <CardBody className="group h-auto w-full">
        <Link
          href={`/rooms/${room.slug}`}
          className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60 transition-shadow duration-500 hover:shadow-card"
        >
          <CardItem translateZ={60} className="w-full">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={room.image}
                alt={room.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
            </div>
          </CardItem>

          <CardItem
            as="span"
            translateZ={90}
            className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium tracking-wide text-black backdrop-blur"
          >
            From ₹{room.priceFrom.toLocaleString("en-IN")}
            <span className="text-muted-foreground"> / night</span>
          </CardItem>

          <CardItem
            as="span"
            translateZ={100}
            className="absolute right-4 top-4 inline-flex size-9 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowUpRight className="size-4" />
          </CardItem>

          <div className="flex flex-1 flex-col p-6">
            <CardItem as="p" translateZ={30} className="eyebrow mb-2">
              {room.tagline}
            </CardItem>
            <CardItem
              as="h3"
              translateZ={50}
              className="font-serif text-2xl text-foreground"
            >
              {room.name}
            </CardItem>
            <CardItem
              as="p"
              translateZ={20}
              className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground"
            >
              {room.description}
            </CardItem>

            <CardItem
              translateZ={40}
              className="mt-5 flex w-full flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                <Maximize className="size-3.5 text-accent" /> {room.size}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BedDouble className="size-3.5 text-accent" /> {room.bed}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="size-3.5 text-accent" /> {room.view}
              </span>
            </CardItem>
          </div>
        </Link>
      </CardBody>
    </CardContainer>
  );
}
