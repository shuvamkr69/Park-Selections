"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import FluidGlassButtonRaw from "@/components/framer/fluid-glass-button";
import "@/components/framer/styles.css";
import { cn } from "@/lib/utils";

// Vendored Framer component (JS, @ts-nocheck). Type only the props we pass.
const FluidGlassButton = FluidGlassButtonRaw as unknown as React.ComponentType<{
  text?: React.ReactNode;
  link?: string;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  padding?: string;
  textFont?: React.CSSProperties;
  style?: React.CSSProperties;
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}>;

/**
 * Shared button — wraps the vendored Framer "Fluid Glass Button" shader
 * component (components/framer/fluid-glass-button).
 *
 * The component's original colours, gradients, glass reflections and shader
 * animation are used exactly as provided — no baseColor / glassColor overrides
 * and no theme integration (that is handled separately). This wrapper only
 * makes it usable as the app's shared button, preserving the existing API:
 * children · href · onClick · disabled · className · size · fullWidth — with
 * client-side routing and accessibility intact.
 */

// The component is content-driven (padding-based); size sets padding + label.
const SIZE = {
  sm: { padding: "12px 26px 12px 26px", fontSize: "13px" },
  md: { padding: "15px 32px 15px 32px", fontSize: "15px" },
  lg: { padding: "19px 42px 19px 42px", fontSize: "17px" },
} as const;

type Size = keyof typeof SIZE;

type CommonProps = {
  children: React.ReactNode;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  "aria-label"?: string;
};

type AsLink = CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof CommonProps | "href"
  >;

type AsButton = CommonProps & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps
  >;

export type GlassButtonProps = AsLink | AsButton;

const isModifiedMouseEvent = (e: React.MouseEvent) =>
  e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

export function GlassButton(props: GlassButtonProps) {
  const router = useRouter();
  const { children, size = "md", fullWidth, className } = props;
  const { padding, fontSize } = SIZE[size];

  const textFont: React.CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize,
    fontWeight: 600,
    letterSpacing: "0.01em",
    textTransform: "none",
  };

  // Override the component's baked-in width/height:100% so it sizes to content
  // (or fills the row when fullWidth). Visual styling stays untouched.
  const boxStyle: React.CSSProperties = {
    width: fullWidth ? "100%" : "auto",
    height: "auto",
  };

  const ariaLabel =
    props["aria-label"] ??
    (typeof children === "string" ? children : undefined);

  const wrapperClass = cn(
    "ps-glass-button",
    fullWidth ? "flex w-full" : "inline-flex",
    className,
  );

  // ── Link ─────────────────────────────────────────────────────────────
  if ("href" in props && props.href !== undefined) {
    const href = props.href;
    const { onClick: userOnClick, target, rel } =
      props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const external = /^(https?:|tel:|mailto:|#)/.test(href);
    // New-tab links always get an opener-safe rel.
    const safeRel =
      target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

    const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
      (userOnClick as ((ev: React.MouseEvent | React.KeyboardEvent) => void) | undefined)?.(e);
      if (e.defaultPrevented) return;
      // Mouse: honour new-tab / modifier clicks via the native <a>.
      if ("button" in e && isModifiedMouseEvent(e as React.MouseEvent)) return;
      // Let the browser handle tel:/mailto:/external/hash links natively.
      if (external) return;
      e.preventDefault();
      router.push(href);
    };

    return (
      <span className={wrapperClass}>
        <FluidGlassButton
          text={children}
          link={href}
          onClick={handleClick}
          padding={padding}
          textFont={textFont}
          style={boxStyle}
          target={target}
          rel={safeRel}
          aria-label={ariaLabel}
        />
      </span>
    );
  }

  // ── Button (onClick / submit / disabled) ─────────────────────────────
  const { onClick, disabled } =
    props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <span className={cn(wrapperClass, disabled && "opacity-60")}>
      <FluidGlassButton
        text={children}
        onClick={
          disabled
            ? undefined
            : (onClick as ((e: React.MouseEvent | React.KeyboardEvent) => void) | undefined)
        }
        padding={padding}
        textFont={textFont}
        style={boxStyle}
        disabled={disabled}
        aria-label={ariaLabel}
      />
    </span>
  );
}
