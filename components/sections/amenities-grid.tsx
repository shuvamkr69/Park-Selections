import { AMENITIES } from "@/constants/services";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/animation/reveal";

export function AmenitiesGrid() {
  return (
    <section className="bg-background py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="Every Comfort"
          title="Thoughtful amenities, effortlessly delivered"
          description="A considered set of services designed to make every stay seamless."
        />

        <Reveal
          stagger
          childSelector="[data-amenity]"
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {AMENITIES.map(({ title, icon: Icon }) => (
            <div
              key={title}
              data-amenity
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-soft"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-muted text-primary transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-medium text-foreground">{title}</span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
