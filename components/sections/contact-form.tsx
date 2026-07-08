"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

const labelClass = "mb-1.5 block text-xs font-medium tracking-wide text-foreground";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    // Simulated submission — wire to a real endpoint / server action here.
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="size-7" />
        </span>
        <h3 className="mt-5 font-serif text-2xl text-foreground">Thank you</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your enquiry has been received. Our reservations team will be in touch
          with you shortly.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClass}>
            Full Name
          </label>
          <input id="name" name="name" required placeholder="Your name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 …"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="checkin" className={labelClass}>
            Check-in
          </label>
          <input id="checkin" name="checkin" type="date" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="checkout" className={labelClass}>
            Check-out
          </label>
          <input id="checkout" name="checkout" type="date" className={fieldClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="interest" className={labelClass}>
            I'm interested in
          </label>
          <select id="interest" name="interest" className={cn(fieldClass, "appearance-none")}>
            <option>A room reservation</option>
            <option>A wedding or event</option>
            <option>A corporate meeting</option>
            <option>Dining at Namaskaram</option>
            <option>Something else</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us how we can help…"
            className={cn(fieldClass, "resize-none")}
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send Enquiry"
        )}
      </Button>
    </form>
  );
}
