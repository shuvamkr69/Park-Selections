import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { SITE, FOOTER_LINKS, SOCIAL_LINKS } from "@/constants/site";
import { formatPhone } from "@/lib/utils";
import { Container } from "@/components/ui/container";

export function Footer() {
  const { contact } = SITE;
  return (
    <footer className="bg-primary text-primary-foreground select-none">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="font-serif text-2xl font-semibold">
              {SITE.name}
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
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
                  className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-14 grid gap-6 border-t border-primary-foreground/15 pt-10 sm:grid-cols-3">
          <a
            href={`tel:${contact.phone}`}
            className="flex items-start gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
            {formatPhone(contact.phone)}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-start gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
            {contact.email}
          </a>
          <a
            href={contact.address.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
            <span>
              {contact.address.line1}, {contact.address.city},{" "}
              {contact.address.state} {contact.address.postalCode}
            </span>
          </a>
        </div>
      </Container>

      <div className="border-t border-primary-foreground/15">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-primary-foreground/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <p>Designed for an unforgettable stay in Bhubaneswar.</p>
        </Container>
      </div>
    </footer>
  );
}
