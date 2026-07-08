import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TextReveal } from "@/components/animation/text-reveal";
import { Reveal } from "@/components/animation/reveal";
import { Parallax } from "@/components/animation/parallax";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  crumbs?: Crumb[];
};

/** Compact immersive hero for interior pages, with breadcrumb. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  crumbs = [],
}: PageHeroProps) {
  return (
    <section className="relative flex h-[62vh] min-h-[440px] items-end overflow-hidden">
      <div className="absolute inset-0">
        <Parallax speed={10} className="absolute -inset-y-[12%] inset-x-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/30" />
      </div>

      <div className="container-px relative z-10 pb-14 text-white md:pb-20">
        {crumbs.length > 0 && (
          <Reveal preset="fadeIn">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex items-center gap-2 text-xs text-white/70"
            >
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white/90">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && (
                    <ChevronRight className="size-3.5 text-white/40" />
                  )}
                </span>
              ))}
            </nav>
          </Reveal>
        )}

        {eyebrow && (
          <Reveal preset="fadeIn">
            <span className="eyebrow text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden />
              {eyebrow}
            </span>
          </Reveal>
        )}

        <TextReveal
          as="h1"
          immediate
          delay={0.15}
          text={title}
          className="mt-4 max-w-3xl text-4xl font-medium sm:text-5xl md:text-6xl"
        />

        {description && (
          <Reveal preset="fadeUp" delay={0.35}>
            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-white/85 md:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
