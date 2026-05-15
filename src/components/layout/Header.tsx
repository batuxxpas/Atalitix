"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { title: "Çözümler", href: "#cozumler" },
  { title: "Yaklaşım", href: "#yaklasim" },
  { title: "Deneyim", href: "#deneyim" },
  { title: "İletişim", href: "#iletisim" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center"
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
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 px-2 py-1.5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                {item.title}
              </a>
            ))}
          </div>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a href="#iletisim" className="btn-primary text-sm py-2.5 px-6">
            Görüşme Planla
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
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
        <div className="md:hidden bg-white border-t border-slate-200 animate-slide-down">
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
    </header>
  );
}
