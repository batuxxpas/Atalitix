"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIntroReady } from "@/components/motion";

const NAV_ITEMS = [
  { title: "Hizmetler", href: "#cozumler" },
  { title: "Kapsam", href: "#kapsam" },
  { title: "Yaklaşım", href: "#yaklasim" },
  { title: "Deneyim", href: "#deneyim" },
  { title: "Haberler", href: "#haberler" },
  { title: "İletişim", href: "#iletisim" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ready = useIntroReady();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={ready ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
      transition={{ duration: 0.7, delay: ready ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur border-b border-[var(--rule)]"
          : "bg-white border-b border-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center"
          aria-label="Atalitix - Ana Sayfa"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image
            src="/atalitixlogo.png"
            alt="Atalitix Logo"
            width={160}
            height={45}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Ana menü">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-[15px] text-[var(--ink-body)] hover:text-[var(--ink)] transition-colors after:absolute after:left-4 after:right-4 after:bottom-1 after:h-px after:bg-[var(--ink)] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a href="#iletisim" className="btn-primary text-[14px] py-2.5 px-5">
            Görüşme Planla
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü" aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-b border-slate-200 animate-slide-down">
          <nav className="container py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {item.title}
              </a>
            ))}
            <a href="#iletisim" onClick={() => setMobileOpen(false)} className="btn-primary text-sm mt-2 justify-center">
              Görüşme Planla
            </a>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
