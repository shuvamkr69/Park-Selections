"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { NAV_ITEMS, SITE } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/interactive/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // The bar stays fixed and visible at all times; only its background
    // transitions once the page scrolls beyond the hero.
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and lock body scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        // Always visible, constant height; only the background transitions.
        " select-none fixed inset-x-0 top-0 z-40 py-4 transition-colors duration-500",
        solid
          ? "border-b border-border/60 bg-background/80 shadow-soft backdrop-blur-lg backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-px flex items-center justify-between gap-6">
        <Link
          href="/"
          className={cn(
            "font-serif text-xl font-semibold tracking-tight transition-colors sm:text-2xl",
            solid ? "text-foreground" : "text-white",
          )}
          aria-label={`${SITE.name} home`}
        >
          {
            <img
              src="https://static.wixstatic.com/media/e08cc7_7b6ce2b6926e4dc4b93697aee1e92037~mv2.png/v1/crop/x_0,y_262,w_1078,h_613/fill/w_980,h_557,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Park-Logo-white.png"
              alt="Park Selections Logo"
              className="h-8 w-auto sm:h-18"
            />
          }
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  solid
                    ? "text-foreground/80 hover:text-foreground"
                    : "text-white/85 hover:text-white",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.contact.phone}`}
            className={cn(
              "hidden items-center gap-2 text-sm font-medium transition-colors md:flex",
              solid
                ? "text-foreground/80 hover:text-foreground"
                : "text-white/85 hover:text-white",
            )}
          >
            <Phone className="size-4" />
            <span className="hidden xl:inline">Reservations</span>
          </a>
          <ThemeToggle lightNav={!solid} />
          <Button
            href="/contact"
            size="sm"
            variant={solid ? "primary" : "light"}
            className="hidden sm:inline-flex"
          >
            Book Now
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full transition-colors lg:hidden",
              solid
                ? "text-foreground hover:bg-foreground/5"
                : "text-white hover:bg-white/10",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden bg-background transition-[max-height,opacity] duration-500 lg:hidden",
          open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="container-px flex flex-col gap-1 py-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-lg px-4 py-3 text-lg font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-muted text-foreground"
                    : "text-foreground/70 hover:bg-muted/60",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 px-4">
            <Button href="/contact" className="w-full">
              Book Your Stay
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
