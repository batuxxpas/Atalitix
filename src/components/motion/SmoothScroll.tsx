"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { INTRO_DONE_EVENT } from "./intro-constants";

/** Removes "#section" from the address bar without adding a history entry. */
function clearHash() {
  if (!window.location.hash) return;
  window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
}

/**
 * Inertial smooth scrolling for public pages (wheel / trackpad); reduced-motion users get none.
 * In-page links (#cozumler, /#egitim …) scroll to their section under the fixed header but never
 * write the hash into the URL, and a reload always opens the page from the top.
 */
export function SmoothScroll() {
  useEffect(() => {
    // A reload starts at the top instead of restoring the last position
    const prevRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce
      ? null
      : new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          autoRaf: true,
        });

    const scrollToTarget = (el: HTMLElement, immediate = false) => {
      if (lenis) lenis.scrollTo(el, { immediate, force: true });
      else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
    };

    // Same-page hash links: scroll ourselves and keep the URL clean.
    // preventDefault (capture phase) also tells Next's <Link> not to navigate; other click
    // handlers on the link (e.g. closing the mobile menu) still run.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      clearHash();
    };
    document.addEventListener("click", onClick, true);

    // A hash typed into the address bar (or set by any other means) on this page
    const onHashChange = () => {
      const el = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
      if (el) scrollToTarget(el);
      clearHash();
    };
    window.addEventListener("hashchange", onHashChange);

    // Hold still while the intro curtain is up
    const root = document.documentElement;
    const onIntroDone = () => lenis?.start();
    if (lenis && root.dataset.intro === "playing") {
      lenis.stop();
      window.addEventListener(INTRO_DONE_EVENT, onIntroDone);
    }

    // Arriving with a hash (e.g. /#egitim from the news page): go to the section, then drop the hash.
    // Otherwise (including a reload) start from the top.
    // Next.js writes its own copy of the URL (with the hash) and may scroll natively just after
    // hydration, so the jump and the clean-up run once more a moment later.
    const timers: number[] = [];
    const hash = window.location.hash;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      for (const ms of [50, 450]) timers.push(window.setTimeout(() => { scrollToTarget(target, true); clearHash(); }, ms));
      timers.push(window.setTimeout(clearHash, 1200));
    } else {
      clearHash();
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true, force: true });
    }

    return () => {
      timers.forEach((x) => window.clearTimeout(x));
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener(INTRO_DONE_EVENT, onIntroDone);
      window.history.scrollRestoration = prevRestoration;
      lenis?.destroy();
    };
  }, []);

  return null;
}
