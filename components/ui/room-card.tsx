import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Maximize, BedDouble, Eye } from "lucide-react";
import type { Room } from "@/types";
import { cn } from "@/lib/utils";

export function RoomCard({ room, className }: { room: Room; className?: string }) {
  return (
    <Link
      href={`/rooms/${room.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60 transition-all duration-500 hover:shadow-card hover:ring-border",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={room.image}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium tracking-wide text-foreground backdrop-blur">
          From ₹{room.priceFrom.toLocaleString("en-IN")}
          <span className="text-muted-foreground"> / night</span>
        </span>
        <span className="absolute right-4 top-4 inline-flex size-9 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow mb-2">{room.tagline}</p>
        <h3 className="font-serif text-2xl text-foreground">{room.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {room.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Maximize className="size-3.5 text-accent" /> {room.size}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5 text-accent" /> {room.bed}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5 text-accent" /> {room.view}
          </span>
        </div>
      </div>
    </Link>
  );
}
