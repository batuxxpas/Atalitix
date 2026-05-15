import type { Metadata } from "next";
import { siteMetadata } from "@/config";
import { ScrollToTop } from "@/components/ui";
import "./globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 antialiased">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
