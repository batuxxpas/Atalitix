import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

/**
 * Site geneli varsayılan metadata
 */
export const siteMetadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ERP Danışmanlığı & Dijital Dönüşüm`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: "Atalitix", url: SITE_CONFIG.url }],
  creator: "Atalitix",
  publisher: "Atalitix",
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — ERP Danışmanlığı & Dijital Dönüşüm`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — Veriden Zekâya, Süreçten Değere`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${SITE_CONFIG.name} — ERP Danışmanlığı & Dijital Dönüşüm`,
    card: "summary_large_image",
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  // Google Search Console doğrulaması için:
  // verification: {
  //   google: "GOOGLE_VERIFICATION_CODE",
  // },
};

