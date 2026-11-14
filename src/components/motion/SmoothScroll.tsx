"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { INTRO_DONE_EVENT } from "./intro-constants";

/**
 * Inertial smooth scrolling for public pages (wheel / trackpad).
 * Touch devices keep their native scrolling; reduced-motion users get none.
 * In-page anchor links are animated and land below the fixed header.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
      autoRaf: true,
    });

    // Hold still while the intro curtain is up
    const root = document.documentElement;
    const onIntroDone = () => lenis.start();
    if (root.dataset.intro === "playing") {
      lenis.stop();
      window.addEventListener(INTRO_DONE_EVENT, onIntroDone);
    }

    // Arriving with a hash (e.g. /#egitim from another page): land under the header
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) setTimeout(() => lenis.scrollTo(target as HTMLElement, { immediate: true }), 50);
    }

    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, onIntroDone);
      lenis.destroy();
    };
  }, []);

  return null;
}
