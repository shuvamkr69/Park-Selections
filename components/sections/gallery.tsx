import Image from "next/image";
import { IMAGES, img } from "@/lib/images";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

const DEFAULT_GALLERY = [
  { src: IMAGES.galleryA, alt: "Elegant suite interior", span: "row-span-2" },
  { src: IMAGES.heroLobby, alt: "Hotel lobby lounge", span: "" },
  { src: IMAGES.diningRestaurant, alt: "Namaskaram restaurant", span: "" },
  { src: IMAGES.spa, alt: "Spa and wellness", span: "" },
  { src: IMAGES.galleryC, alt: "Guest room detail", span: "row-span-2" },
  { src: IMAGES.wedding, alt: "Wedding celebration", span: "" },
];

export function Gallery({
  eyebrow = "Gallery",
  title = "A glimpse of Park Selections",
  description,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section id="gallery" className="scroll-mt-24 bg-background py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="left"
          className="max-w-2xl"
        />

        <Reveal
          stagger
          childSelector="[data-tile]"
          className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3 md:auto-rows-[220px]"
        >
          {DEFAULT_GALLERY.map((tile, i) => (
            <figure
              key={i}
              data-tile
              className={cn(
                "group relative overflow-hidden rounded-xl",
                tile.span,
              )}
            >
              <Image
                src={img(tile.src, 900)}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/20" />
            </figure>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
