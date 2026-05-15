import type { NavItem } from "@/types";

/**
 * Uygulama sabitleri
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Atalitix";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Site meta bilgileri
 */
export const SITE_CONFIG = {
  name: APP_NAME,
  description: "Atalitix - Modern Analitik ve Yönetim Platformu",
  url: APP_URL,
  ogImage: `${APP_URL}/og.png`,
  links: {
    github: "https://github.com/atalitix",
  },
} as const;

/**
 * Ana navigasyon menüsü
 */
export const MAIN_NAV: NavItem[] = [
  {
    title: "Ana Sayfa",
    href: "/",
  },
  {
    title: "Özellikler",
    href: "/features",
  },
  {
    title: "Fiyatlandırma",
    href: "/pricing",
  },
  {
    title: "Hakkımızda",
    href: "/about",
  },
  {
    title: "İletişim",
    href: "/contact",
  },
];

/**
 * Dashboard sidebar navigasyonu
 */
export const DASHBOARD_NAV: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Analitik",
    href: "/dashboard/analytics",
    icon: "BarChart3",
  },
  {
    title: "Kullanıcılar",
    href: "/dashboard/users",
    icon: "Users",
  },
  {
    title: "Projeler",
    href: "/dashboard/projects",
    icon: "FolderKanban",
  },
  {
    title: "Raporlar",
    href: "/dashboard/reports",
    icon: "FileText",
  },
  {
    title: "Ayarlar",
    href: "/dashboard/settings",
    icon: "Settings",
  },
];

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * Toast / Bildirim süreleri (ms)
 */
export const TOAST_DURATION = {
  DEFAULT: 3000,
  SUCCESS: 2000,
  ERROR: 5000,
  WARNING: 4000,
} as const;
