import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { siteMetadata } from "@/config";
import { ScrollToTop } from "@/components/ui";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-plex",
});

const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-serif4",
  style: ["normal", "italic"],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${plex.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-white antialiased">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}

