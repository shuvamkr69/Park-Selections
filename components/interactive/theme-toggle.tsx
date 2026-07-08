"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";

interface ThemeToggleProps {
  /** True when the navbar is transparent (over hero) — renders white icon. */
  lightNav?: boolean;
  className?: string;
}

export function ThemeToggle({ lightNav, className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  // Avoid hydration mismatch: the server always renders light; the correct
  // icon appears after mount (one frame, no visible flash).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        lightNav
          ? "text-white hover:bg-white/10"
          : "text-foreground hover:bg-foreground/5",
        className,
      )}
    >
      {isDark ? (
        <Sun className="size-[1.1rem]" strokeWidth={1.75} aria-hidden />
      ) : (
        <Moon className="size-[1.1rem]" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}
