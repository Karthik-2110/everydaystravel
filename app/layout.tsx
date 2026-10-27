import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import MarketingChrome from "./components/MarketingChrome";
import { businessSchema, siteUrl, webSiteSchema } from './lib/seo';

// Inter is the whole typographic system: --font-sans feeds --font-ui,
// --font-body and --font-display alike (see globals.css). One family, one
// download, no second face to load or keep in step.
//
// No `weight` list: Inter ships as a variable font, so every weight the site
// uses comes from a single file rather than one file per weight.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: { google: 'eyMW9ia0hbk1XVGSi2Ziu6cMwuep94yi-CiRCKsFtTU' },
  title: "Coach Hire London & Minibus Hire with Driver | Everydays Travel",
  description: "Coach and minibus hire with a driver in London and Surrey. Explore 7 to 55-seat group vehicles for schools, corporate events, weddings and airport transfers. Request a quote.",
  keywords: [
    'Everydays Travel',
    'Everydays Luxury Travel',
    'coach hire Sunbury-on-Thames',
    'minibus hire Richmond',
    'minibus hire Hampton',
    'Surrey coach operators',
    'luxury minibus hire with driver',
    'large coach hire London',
    'wedding coach hire London',
    'airport transfers London',
    'guided London tours',
  ],
  alternates: {
    canonical: '/',
    languages: { 'en-GB': '/', 'x-default': '/' },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    siteName: 'Everydays Travel',
    title: 'Coach Hire London & Minibus Hire with Driver | Everydays Travel',
    description: 'Luxury coach, minibus and chauffeur-driven travel across London, Surrey, the UK and Europe.',
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
      className={cn(
        "h-full antialiased",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-[#0C0F1C] text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([businessSchema, webSiteSchema]).replace(/</g, '\\u003c'),
          }}
        />
        {children}
        <MarketingChrome />
      </body>
    </html>
  );
}
