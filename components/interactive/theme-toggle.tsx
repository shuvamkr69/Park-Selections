"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface ThemeToggleProps {
  /** True when the navbar is transparent (over hero) — renders white icon. */
  lightNav?: boolean;
  className?: string;
}

export function ThemeToggle({ lightNav, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AnimatedThemeToggler
      theme={theme as "light" | "dark"}
      onThemeChange={setTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        lightNav
          ? "text-white hover:bg-white/10"
          : "text-foreground hover:bg-foreground/5",
        className,
      )}
    />
  );
}
