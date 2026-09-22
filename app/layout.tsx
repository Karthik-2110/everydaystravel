import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import FloatingContactBar from "./components/FloatingContactBar";
import { businessSchema, siteUrl, webSiteSchema } from './lib/seo';

// Inter → drives --font-sans (shadcn) and --font-ui (brand)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Source Sans 3 → drives --font-body (brand)
const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Everydays Travel | Luxury Coach & Minibus Hire Across the UK",
  description: "Luxury coach, minibus and chauffeur-driven travel across London, Surrey, the UK and Europe. Airport transfers, corporate events, weddings and private tours.",
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
    title: 'Everydays Travel | Luxury Coach & Minibus Hire Across the UK',
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
        sourceSans3.variable,
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
        <FloatingContactBar />
      </body>
    </html>
  );
}
