import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono, DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";

// Bricolage Grotesque for headings, DM Sans for body, DM Mono for labels — both variable
// families keep their optical-size axis (font-optical-sizing: auto). Newsreader Italic is
// only used for the single accent word in the hero headline.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

const mono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Email Revenue Calculator — Zero Noise",
  description:
    "Three questions, one number. See the revenue your email list should already be producing — and the range it reaches once the emails are doing their job.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Browser extensions (ColorZilla, password managers…) add attributes to <html>/<body>
    // before React hydrates; suppress that one-level mismatch warning.
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
