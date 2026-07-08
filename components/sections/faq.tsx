"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/types";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

export function FAQ({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-background py-20 md:py-28">
      <Container className="max-w-3xl">
        <SectionHeader
          eyebrow="Good to Know"
          title="Frequently asked questions"
        />

        <div className="mt-12 divide-y divide-border border-y border-border">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-serif text-lg text-foreground md:text-xl">
                    {item.question}
                  </span>
                  <Plus
                    className={cn(
                      "size-5 shrink-0 text-accent transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
