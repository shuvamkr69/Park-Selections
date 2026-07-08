import { CONTENT } from "@/constants/content";
import { Container } from "@/components/ui/container";
import { Counter } from "@/components/animation/counter";
import { Reveal } from "@/components/animation/reveal";

export function Stats() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-20">
      <Container>
        <Reveal
          stagger
          childSelector="[data-stat]"
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {CONTENT.stats.map((stat) => (
            <div key={stat.label} data-stat className="text-center">
              <div className="font-serif text-4xl text-accent md:text-6xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm tracking-wide text-primary-foreground/70">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
