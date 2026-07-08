import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE } from "@/constants/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { Preloader } from "@/components/layout/preloader";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import { FluidCursor } from "@/components/interactive/fluid-cursor";

// Injected before first paint to eliminate theme flash.
// Reads localStorage → falls back to system preference → sets data-theme.
const themeInitScript = `(function(){try{var s=localStorage.getItem('ps-theme');var t=(s==='dark'||s==='light')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.seoTitle,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.seoDescription,
  keywords: [
    "Park Selections",
    "luxury hotel Bhubaneswar",
    "hotel near KIIT",
    "wedding venue Bhubaneswar",
    "best hotel Patia",
  ],
  authors: [{ name: SITE.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.seoTitle,
    description: SITE.seoDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seoTitle,
    description: SITE.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      {/* Anti-flash script — runs synchronously before first paint */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground">
        <ThemeProvider>
          <Preloader />
          <FluidCursor />
          <SmoothScrollProvider>
            <Navbar />
            <PageTransition>
              <main id="main">{children}</main>
            </PageTransition>
            <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
