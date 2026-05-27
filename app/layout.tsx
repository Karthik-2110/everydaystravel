import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
  title: "Everydays Travel | Luxury Coach & Minibus Hire Across the UK",
  description: "Premium coach, minibus and private car hire across the UK. Airport transfers, corporate travel and group transport. Get an instant quote.",
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
        {children}
      </body>
    </html>
  );
}
