import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

// Fonts match the design file exactly: Bricolage Grotesque 600 for headings,
// DM Sans for body, DM Mono for labels. Both variable families keep their
// optical-size axis so the browser sets it from the font size (font-optical-sizing: auto).
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

export const metadata: Metadata = {
  title: "Ishikaa Jain — Email marketing for coaches & consultants",
  description:
    "Welcome, nurture and sales emails that turn your list into booked calls. Try the free calculator to see what your email list could be earning.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Browser extensions (ColorZilla, password managers…) add attributes to <html>/<body>
    // before React hydrates; suppress that one-level mismatch warning.
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
