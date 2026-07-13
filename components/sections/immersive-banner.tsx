import Image from "next/image";
import type { ReactNode } from "react";
import { Parallax } from "@/components/animation/parallax";
import { Reveal } from "@/components/animation/reveal";
import { TextReveal } from "@/components/animation/text-reveal";
import { cn } from "@/lib/utils";

type ImmersiveBannerProps = {
  eyebrow?: string;
  statement: string | readonly string[];
  image: string;
  imageAlt?: string;
  /** Render the statement as a paragraph (e.g. for quotes) instead of an h2. */
  statementAs?: "h2" | "p";
  children?: ReactNode;
  className?: string;
};

/**
 * Full-width immersive statement band — a parallax image under a deep primary
 * scrim with a single centred serif statement. Used as an elegant transition
 * between content sections on interior pages.
 */
export function ImmersiveBanner({
  eyebrow,
  statement,
  image,
  imageAlt = "",
  statementAs = "h2",
  children,
  className,
}: ImmersiveBannerProps) {
  return (
    <section className={cn("relative overflow-hidden py-28 md:py-44", className)}>
      <div className="absolute inset-0">
        <Parallax speed={12} className="absolute -inset-y-[14%] inset-x-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-primary/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-primary/70" />
      </div>

      <div className="container-px relative z-10 mx-auto max-w-4xl text-center">
        {eyebrow && (
          <Reveal preset="fadeIn">
            <span className="eyebrow justify-center text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden />
              {eyebrow}
              <span className="h-px w-8 bg-accent" aria-hidden />
            </span>
          </Reveal>
        )}
        <TextReveal
          as={statementAs}
          text={statement}
          className={cn(
            "mt-6 font-serif text-3xl leading-tight text-white sm:text-4xl md:text-5xl",
            statementAs === "p" && "md:leading-snug",
          )}
        />
        {children && (
          <Reveal preset="fadeUp" delay={0.25}>
            <div className="mt-8">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
