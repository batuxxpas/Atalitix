"use client";

import { useState, useEffect } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 400px
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-[3px] bg-[var(--brand-navy)] text-white transition-all duration-300 hover:bg-[var(--brand-blue)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Yukarı Çık"
      title="Yukarı Çık"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
