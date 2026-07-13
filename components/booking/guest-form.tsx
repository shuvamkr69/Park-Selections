"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import type { GuestState } from "./shared";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

const labelClass =
  "mb-1.5 block text-xs font-medium tracking-wide text-foreground";

type Errors = Partial<Record<keyof GuestState, string>>;

function validate(guest: GuestState): Errors {
  const errors: Errors = {};
  if (guest.firstName.trim().length < 2)
    errors.firstName = "Please enter your first name.";
  if (guest.lastName.trim().length < 2)
    errors.lastName = "Please enter your last name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(guest.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!/^\+?[0-9][0-9\s-]{8,14}$/.test(guest.phone.trim()))
    errors.phone = "Please enter a valid phone number.";
  if (guest.requests.length > 500)
    errors.requests = "Please keep requests under 500 characters.";
  return errors;
}

type GuestFormProps = {
  guest: GuestState;
  onChange: (guest: GuestState) => void;
  onBack: () => void;
  onSubmit: () => void;
};

/** Guest details step with live validation. */
export function GuestForm({ guest, onChange, onBack, onSubmit }: GuestFormProps) {
  const [touched, setTouched] = useState<Partial<Record<keyof GuestState, boolean>>>({});
  const errors = useMemo(() => validate(guest), [guest]);

  const touch = (field: keyof GuestState) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const showError = (field: keyof GuestState) =>
    touched[field] ? errors[field] : undefined;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        requests: true,
      });
      const first = e.currentTarget.querySelector<HTMLElement>(
        '[aria-invalid="true"]',
      );
      first?.focus();
      return;
    }
    onSubmit();
  };

  const field = (
    name: keyof GuestState,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => {
    const error = showError(name);
    return (
      <div>
        <label htmlFor={`guest-${name}`} className={labelClass}>
          {label}
        </label>
        <input
          id={`guest-${name}`}
          value={guest[name]}
          onChange={(e) => onChange({ ...guest, [name]: e.target.value })}
          onBlur={() => touch(name)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `guest-${name}-error` : undefined}
          className={cn(fieldClass, error && "border-red-400 focus:border-red-400 focus:ring-red-200")}
          {...props}
        />
        <p
          id={`guest-${name}-error`}
          aria-live="polite"
          className="mt-1 min-h-4 text-xs text-red-500"
        >
          {error ?? ""}
        </p>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
    >
      <p className="eyebrow">
        <span className="h-px w-8 bg-accent" aria-hidden />
        Guest Details
      </p>
      <h3 className="mt-3 font-serif text-2xl text-foreground md:text-3xl">
        Who are we welcoming?
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The reservation will be held under these details.
      </p>

      <div className="mt-7 grid gap-x-5 gap-y-2 sm:grid-cols-2">
        {field("firstName", "First Name", {
          placeholder: "First name",
          autoComplete: "given-name",
          required: true,
        })}
        {field("lastName", "Last Name", {
          placeholder: "Last name",
          autoComplete: "family-name",
          required: true,
        })}
        {field("email", "Email", {
          type: "email",
          placeholder: "you@email.com",
          autoComplete: "email",
          required: true,
        })}
        {field("phone", "Phone", {
          type: "tel",
          placeholder: "+91 …",
          autoComplete: "tel",
          required: true,
        })}
      </div>

      <div className="mt-2">
        <label htmlFor="guest-requests" className={labelClass}>
          Special Requests <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="guest-requests"
          rows={4}
          value={guest.requests}
          onChange={(e) => onChange({ ...guest, requests: e.target.value })}
          onBlur={() => touch("requests")}
          placeholder="Early check-in, floor preference, celebrations…"
          aria-invalid={Boolean(showError("requests"))}
          className={cn(fieldClass, "resize-none", showError("requests") && "border-red-400")}
        />
        <p aria-live="polite" className="mt-1 min-h-4 text-xs text-red-500">
          {showError("requests") ?? ""}
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse items-stretch gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to rooms
        </button>
        <GlassButton type="submit" size="md">
          Review Reservation
        </GlassButton>
      </div>
    </form>
  );
}
