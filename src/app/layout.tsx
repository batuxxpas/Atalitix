import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteMetadata } from "@/config";
import { ScrollToTop } from "@/components/ui";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-slate-950 antialiased`}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}

