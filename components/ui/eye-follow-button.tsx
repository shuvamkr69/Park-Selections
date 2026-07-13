"use client";

import {
  useEffect,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";
import EyeFollowFramerRaw from "@/components/framer/eye-follow-button";
import "@/components/framer/styles.css";
import { useTheme } from "@/components/providers/theme-provider";

// The vendored Framer component is JS with @ts-nocheck; type its used props.
const EyeFollowFramer = EyeFollowFramerRaw as unknown as ComponentType<{
  text?: string;
  link?: string;
  buttonColor?: string;
  textColor?: string;
  eyeColor?: string;
  pupilColor?: string;
  eyeSizePx?: number;
  pupilSizePx?: number;
  eyeGapPx?: number;
  style?: CSSProperties;
}>;

/**
 * Wrapper around the vendored Framer "Eye Follow Button" (components/framer),
 * used only for the navbar "Book Now" CTA. It stays theme-aware by reading the
 * live design tokens from CSS and feeding them to the Framer colour props
 * (the eyes are canvas-driven, so they need concrete colours, not var()).
 */

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

type EyeFollowButtonProps = {
  text: string;
  href: string;
  className?: string;
};

export function EyeFollowButton({
  text,
  href,
  className,
}: EyeFollowButtonProps) {
  const { theme } = useTheme();
  const isExternal = /^https?:\/\//.test(href);

  // External targets (e.g. the official booking engine) open in a new tab
  // with an opener-safe window, regardless of how the vendored Framer link
  // renders its anchor internally.
  const handleClickCapture = (e: React.MouseEvent) => {
    if (!isExternal) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
      return; // let modifier clicks use native anchor behaviour
    e.preventDefault();
    e.stopPropagation();
    window.open(href, "_blank", "noopener,noreferrer");
  };
  const [colors, setColors] = useState({
    button: "#b8935a",
    text: "#1c1b18",
    eye: "#ffffff",
    pupil: "#000000",
  });

  // Re-read the tokens whenever the theme flips.
  useEffect(() => {
    setColors({
      button: readVar("--accent", "#b8935a"),
      text: readVar("--accent-foreground", "#1c1b18"),
      eye: "#ffffff",
      pupil: readVar("#000000", "#000000"),
    });
  }, [theme]);

  return (
    <div className={className} onClickCapture={handleClickCapture}>
      <EyeFollowFramer
        text={text}
        link={href}
        buttonColor={colors.button}
        textColor={colors.text}
        eyeColor={colors.eye}
        pupilColor={colors.pupil}
        eyeSizePx={20}
        pupilSizePx={9}
        eyeGapPx={4}
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );
}
