import Image from "next/image";
import { IMAGES, img } from "@/lib/images";
import { CONTENT } from "@/constants/content";
import { SITE } from "@/constants/site";
import { Container } from "@/components/ui/container";
import { GlassButton } from "@/components/ui/glass-button";
import { TextReveal } from "@/components/animation/text-reveal";
import { Reveal } from "@/components/animation/reveal";

export function CTA() {
  const { cta } = CONTENT;
  return (
    <section className="relative overflow-hidden py-24 text-white md:py-32">
      <Image
        src={img(IMAGES.heroPool, 2000)}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-primary/85" />

      <Container className="relative z-10 flex flex-col items-center text-center">
        <Reveal preset="fadeIn">
          <span className="eyebrow text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden />
            {cta.eyebrow}
            <span className="h-px w-8 bg-accent" aria-hidden />
          </span>
        </Reveal>
        <TextReveal
          as="h2"
          text={cta.title}
          className="mt-6 max-w-2xl text-balance text-3xl font-medium sm:text-4xl md:text-5xl"
        />
        <Reveal preset="fadeUp" delay={0.1}>
          <p className="mx-auto mt-5 max-w-lg text-balance text-white/80 md:text-lg">
            {cta.body}
          </p>
        </Reveal>
        <Reveal preset="fadeUp" delay={0.2}>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <GlassButton href={cta.primary.href} size="lg">
              {cta.primary.label}
            </GlassButton>
            <GlassButton href={`tel:${SITE.contact.phone}`} size="lg">
              {cta.secondary.label}
            </GlassButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
