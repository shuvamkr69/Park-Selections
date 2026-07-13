import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { SITE, FOOTER_LINKS, SOCIAL_LINKS } from "@/constants/site";
import { formatPhone } from "@/lib/utils";
import { Container } from "@/components/ui/container";

/**
 * Premium site footer — tagline band with a reserve CTA, brand + link columns
 * with elegant hover interactions, a dedicated contact column, and a giant
 * serif watermark anchoring the base. All links and contact details come from
 * the centralized site constants.
 */
export function Footer() {
  const { contact } = SITE;

  return (
    <footer className="relative select-none overflow-hidden bg-primary text-primary-foreground">
      {/* Giant wordmark watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-[1vw] select-none whitespace-nowrap text-center font-serif text-[15vw] font-semibold leading-none tracking-tight text-primary-foreground/[0.04]"
      >
        Park Selections
      </span>

      {/* ── Tagline band ───────────────────────────────────────────── */}
      <Container className="relative z-10 pt-16 md:pt-24">
        <div className="flex flex-col gap-10 border-b border-primary-foreground/10 pb-12 md:flex-row md:items-end md:justify-between md:pb-16">
          <div>
            <span className="eyebrow text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden />
              {SITE.name}
            </span>
            <p className="mt-4 max-w-xl font-serif text-3xl leading-tight md:text-5xl">
              {SITE.tagline}
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-4 text-sm font-medium tracking-wide"
          >
            <span className="relative">
              Reserve your stay
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
              />
            </span>
            <span className="flex size-12 items-center justify-center rounded-full border border-primary-foreground/25 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
              <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
            </span>
          </Link>
        </div>

        {/* ── Main grid ──────────────────────────────────────────────── */}
        <div className="grid gap-12 py-14 md:grid-cols-2 md:py-16 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="font-serif text-2xl font-semibold transition-colors hover:text-accent"
            >
              {SITE.name}
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/65">
              {SITE.shortDescription}
            </p>
            <div className="flex gap-3 pt-1">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-5">
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-primary-foreground/65 transition-colors duration-300 hover:text-primary-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`tel:${contact.phone}`}
                  className="group flex items-start gap-3 text-sm text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                  {formatPhone(contact.phone)}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex items-start gap-3 text-sm text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="break-all">{contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={contact.address.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm leading-relaxed text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    {contact.address.line1},
                    <br />
                    {contact.address.line2},
                    <br />
                    {contact.address.city}, {contact.address.state}{" "}
                    {contact.address.postalCode}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* ── Legal bar ──────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-primary-foreground/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-7 text-xs text-primary-foreground/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <p>Designed for an unforgettable stay in Bhubaneswar.</p>
        </Container>
      </div>
    </footer>
  );
}
