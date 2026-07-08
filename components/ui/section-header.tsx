import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animation/reveal";
import { TextReveal } from "@/components/animation/text-reveal";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string | readonly string[];
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** Render title in light colour for use over dark backgrounds. */
  light?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start text-left",
        className,
      )}
    >
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
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl",
          light ? "text-primary-foreground" : "text-foreground",
        )}
      />
      {description && (
        <Reveal preset="fadeUp" delay={0.1}>
          <p
            className={cn(
              "max-w-xl text-base leading-relaxed md:text-lg",
              light ? "text-primary-foreground/75" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
