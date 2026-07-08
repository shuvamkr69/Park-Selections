import type { SVGProps } from "react";

/**
 * Brand/social glyphs. lucide-react no longer ships trademarked logos, so we
 * keep lightweight inline SVGs here. Each accepts `className` and inherits
 * `currentColor` like a lucide icon.
 */
type IconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 8.5V7c0-.8.2-1.2 1.3-1.2H17V3h-2.5C11.9 3 11 4.3 11 6.5v2H9V11h2v10h3v-10h2.2l.4-2.5H14Z" />
    </svg>
  );
}

export function XTwitterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.53 3H20.4l-6.27 7.17L21.5 21h-5.77l-4.52-5.9L5.84 21H2.97l6.7-7.66L2.5 3h5.92l4.08 5.4L17.53 3Zm-1 16.2h1.6L7.54 4.7H5.83l10.7 14.5Z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12ZM9.8 15.1V8.9l5.3 3.1-5.3 3.1Z" />
    </svg>
  );
}
