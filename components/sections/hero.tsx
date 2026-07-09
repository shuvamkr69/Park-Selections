import Image from "next/image";
import { IMAGES, img } from "@/lib/images";
import { CONTENT } from "@/constants/content";
import { GlassButton } from "@/components/ui/glass-button";
import { Parallax } from "@/components/animation/parallax";
import { TextReveal } from "@/components/animation/text-reveal";
import { Reveal } from "@/components/animation/reveal";
import { ScrollIndicator } from "@/components/layout/scroll-indicator";

/** Full-screen immersive home hero. */
export function Hero() {
  const { hero } = CONTENT;
  return (
    <section className="relative flex h-dvh min-h-[640px] items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0">
        <Parallax speed={12} className="absolute -inset-y-[12%] inset-x-0">
          <Image
            src={img(IMAGES.heroExterior, 2000)}
            alt="Park Selections luxury hotel in Bhubaneswar at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/80" />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Content */}
      <div className="container-px relative z-10 flex flex-col items-center text-center text-white">
        <Reveal preset="fadeIn" delay={0.2}>
          <span className="eyebrow text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden />
            {hero.eyebrow}
            <span className="h-px w-8 bg-accent" aria-hidden />
          </span>
        </Reveal>

        <TextReveal
          as="h1"
          immediate
          delay={0.35}
          text={hero.title}
          className="mt-6 max-w-4xl text-balance text-4xl font-medium sm:text-6xl md:text-7xl lg:text-[5.25rem]"
        />
        

        <Reveal preset="fadeUp" delay={0.7}>
          <p className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-white/85 md:text-lg">
            {hero.subtitle}
          </p>
        </Reveal>

        <Reveal preset="fadeUp" delay={0.85}>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <GlassButton href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </GlassButton>
            <GlassButton href={hero.secondaryCta.href} size="lg">
              {hero.secondaryCta.label}
            </GlassButton>
          </div>
        </Reveal>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <ScrollIndicator />
      </div>
    </section>
  );
}
