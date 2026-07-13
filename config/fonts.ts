/**
 * ────────────────────────────────────────────────────────────────────────
 *  TYPOGRAPHY SOURCE OF TRUTH
 * ────────────────────────────────────────────────────────────────────────
 *
 * To change a typeface across the entire site, swap the font import and the
 * loader call here. The exposed CSS variable names (`--font-sans-family`,
 * `--font-serif-family`) are what `app/theme.css` maps onto Tailwind's
 * `font-sans` / `font-serif` utilities - leave those names unchanged and every
 * component picks up the new font automatically.
 */

import { Inter, Playfair_Display } from "next/font/google";

/** Body / UI text - paragraphs, labels, buttons, navigation. */
export const fontSans = Inter({
  variable: "--font-sans-family",
  subsets: ["latin"],
  display: "swap",
});

/** Display / headings - titles, and the bold statistic figures. */
export const fontSerif = Playfair_Display({
  variable: "--font-serif-family",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

/** Applied to <html> so both font variables are available site-wide. */
export const fontVariables = `${fontSans.variable} ${fontSerif.variable}`;
