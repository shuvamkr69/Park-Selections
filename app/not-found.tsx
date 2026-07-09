import Link from "next/link";
import { GlassButton } from "@/components/ui/glass-button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-background py-32">
      <Container className="flex flex-col items-center text-center">
        <span className="eyebrow">
          <span className="h-px w-8 bg-accent" aria-hidden />
          Error 404
        </span>
        <h1 className="mt-6 font-serif text-5xl text-foreground md:text-7xl">
          Page not found
        </h1>
        <p className="mt-5 max-w-md text-muted-foreground">
          The page you're looking for has checked out. Let us guide you back to
          the comfort of Park Selections.
        </p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <GlassButton href="/" size="lg">
            Return Home
          </GlassButton>
          <GlassButton href="/rooms" size="lg">
            Explore Rooms
          </GlassButton>
        </div>
        <Link
          href="/contact"
          className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Need help? Contact us
        </Link>
      </Container>
    </section>
  );
}
