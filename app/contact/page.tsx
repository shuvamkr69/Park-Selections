import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { IMAGES, img } from "@/lib/images";
import { SITE } from "@/constants/site";
import { CONTENT } from "@/constants/content";
import { formatPhone } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { FAQ } from "@/components/sections/faq";
import { Reveal } from "@/components/animation/reveal";

export const metadata: Metadata = {
  title: "Contact & Reservations",
  description:
    "Contact Park Selections Bhubaneswar for reservations, weddings and events. Call +91 97776 50375 or email reservations@parkselections.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact } = SITE;
  const details = [
    {
      icon: Phone,
      label: "Call Us",
      value: formatPhone(contact.phone),
      href: `tel:${contact.phone}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: MapPin,
      label: "Visit",
      value: `${contact.address.line1}, ${contact.address.city}, ${contact.address.state} ${contact.address.postalCode}`,
      href: contact.address.mapUrl,
    },
    {
      icon: Clock,
      label: "Reception",
      value: "Open 24 hours · Check-in 2 PM",
    },
  ];

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    "Park Selections KIIT Road Bhubaneswar",
  )}&z=15&output=embed`;

  return (
    <>
      <PageHero
        eyebrow="Contact & Reservations"
        title="We'd love to host you"
        description="Reach out to plan your stay, celebration or corporate gathering — our team responds promptly."
        image={img(IMAGES.heroLobby, 2000)}
        imageAlt="Park Selections reception"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="bg-background py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            {/* Details */}
            <div>
              <Reveal preset="fadeUp">
                <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                  Get in touch
                </h2>
                <p className="mt-4 max-w-md text-muted-foreground">
                  Whether you're planning a stay near KIIT or a grand celebration,
                  we're here to help make it effortless.
                </p>
              </Reveal>

              <Reveal stagger className="mt-10 grid gap-4 sm:grid-cols-2">
                {details.map(({ icon: Icon, label, value, href }) => {
                  const content = (
                    <>
                      <span className="inline-flex size-11 items-center justify-center rounded-full bg-muted text-primary">
                        <Icon className="size-5" />
                      </span>
                      <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {value}
                      </p>
                    </>
                  );
                  return href ? (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/60"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={label}
                      className="rounded-2xl border border-border bg-card p-6"
                    >
                      {content}
                    </div>
                  );
                })}
              </Reveal>

              <Reveal preset="fadeUp" className="mt-6">
                <div
                  id="location"
                  className="relative aspect-[16/10] scroll-mt-24 overflow-hidden rounded-2xl border border-border"
                >
                  <iframe
                    title="Park Selections location map"
                    src={mapSrc}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal preset="fadeUp" delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>

      <FAQ items={[...CONTENT.faqs]} />
    </>
  );
}
