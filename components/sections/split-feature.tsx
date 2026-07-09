import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { GlassButton } from "@/components/ui/glass-button";
import { TextReveal } from "@/components/animation/text-reveal";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

type SplitFeatureProps = {
  eyebrow?: string;
  title: string | readonly string[];
  body: string | readonly string[];
  image: string;
  imageAlt: string;
  /** Place the image on the right instead of the left. */
  reverse?: boolean;
  bullets?: string[];
  cta?: { label: string; href: string };
  secondaryImage?: string;
  className?: string;
};

/** Reusable alternating image + content section. */
export function SplitFeature({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  reverse = false,
  bullets,
  cta,
  secondaryImage,
  className,
}: SplitFeatureProps) {
  const paragraphs: string[] = Array.isArray(body) ? [...body] : [body];

  return (
    <section className={cn("bg-background py-20 md:py-28", className)}>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Media */}
          <Reveal
            preset={reverse ? "slideLeft" : "slideRight"}
            className={cn("relative", reverse && "lg:order-2")}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-card sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {secondaryImage && (
              <div
                className="absolute -bottom-8 hidden aspect-square w-40 overflow-hidden rounded-xl border-4 border-background shadow-lift sm:block lg:w-48"
                style={reverse ? { left: "-2rem" } : { right: "-2rem" }}
              >
                <Image
                  src={secondaryImage}
                  alt=""
                  fill
                  sizes="12rem"
                  className="object-cover"
                />
              </div>
            )}
          </Reveal>

          {/* Content */}
          <div className={cn(reverse && "lg:order-1")}>
            {eyebrow && (
              <Reveal preset="fadeIn">
                <span className="eyebrow">
                  <span className="h-px w-8 bg-accent" aria-hidden />
                  {eyebrow}
                </span>
              </Reveal>
            )}
            <TextReveal
              as="h2"
              text={title}
              className="mt-4 text-3xl text-foreground sm:text-4xl md:text-5xl"
            />
            <Reveal preset="fadeUp" delay={0.1}>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>

            {bullets && (
              <Reveal
                stagger
                childSelector="li"
                as="ul"
                className="mt-7 grid gap-3 sm:grid-cols-2"
              >
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-sm text-foreground uppercase"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    {b}
                  </li>
                ))}
              </Reveal>
            )}

            {cta && (
              <Reveal preset="fadeUp" delay={0.2}>
                <div className="mt-9">
                  <GlassButton href={cta.href} size="lg">
                    {cta.label}
                  </GlassButton>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
