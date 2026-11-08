"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { INTRO_DONE_EVENT, INTRO_STORAGE_KEY } from "./intro-constants";

const EASE = [0.76, 0, 0.24, 1] as const;

// Flipped just before the "done" event so late subscribers also read it as ready
let released = false;
function releaseIntro() {
  released = true;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}
const subscribe = (cb: () => void) => {
  window.addEventListener(INTRO_DONE_EVENT, cb);
  return () => window.removeEventListener(INTRO_DONE_EVENT, cb);
};

/** True once the intro has lifted (or immediately when it is not playing). */
export function useIntroReady() {
  return useSyncExternalStore(
    subscribe,
    () => released || document.documentElement.dataset.intro !== "playing",
    () => false,
  );
}

/**
 * Short, quiet opening: the logo is unveiled, a single rule is drawn beneath it,
 * then the white sheet wipes upward to reveal the page.
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<"run" | "exit" | "done">("run");

  useEffect(() => {
    const root = document.documentElement;
    // Not playing: the overlay stays hidden by CSS
    if (root.dataset.intro !== "playing") return;

    const tExit = setTimeout(() => setPhase("exit"), 1300);
    const tReady = setTimeout(releaseIntro, 1550);
    const tDone = setTimeout(() => {
      root.dataset.intro = "done";
      try { sessionStorage.setItem(INTRO_STORAGE_KEY, "1"); } catch {}
      setPhase("done");
    }, 2250);
    return () => {
      clearTimeout(tExit);
      clearTimeout(tReady);
      clearTimeout(tDone);
    };
  }, []);

  if (phase === "done") return null;
  const exiting = phase === "exit";

  return (
    <motion.div
      className="intro-overlay fixed inset-0 z-[200] bg-white pointer-events-none"
      aria-hidden="true"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: exiting ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <motion.div
          className="flex flex-col items-center"
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? -16 : 0 }}
          transition={{ duration: 0.35, ease: "easeIn" }}
        >
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
          >
            <Image src="/atalitixlogo.png" alt="" width={260} height={70} priority className="h-12 md:h-14 w-auto" />
          </motion.div>
          <motion.span
            className="mt-6 block h-px w-48 origin-left bg-[var(--brand-navy)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
