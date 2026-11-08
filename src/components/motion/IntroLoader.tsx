"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

import { INTRO_DONE_EVENT, INTRO_STORAGE_KEY as STORAGE_KEY } from "./intro-constants";
const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const;

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

// Network motif echoing the node graph in the logo mark
const NODES = [
  { x: 12, y: 46 },
  { x: 38, y: 18 },
  { x: 44, y: 58 },
  { x: 70, y: 34 },
  { x: 92, y: 62 },
];
const EDGES: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [2, 4]];

export function IntroLoader() {
  const [phase, setPhase] = useState<"run" | "exit" | "done">("run");
  const progress = useMotionValue(0);
  const pct = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const barScale = useTransform(progress, [0, 100], [0, 1]);

  useEffect(() => {
    const root = document.documentElement;
    // Not playing: the overlay stays hidden by CSS, nothing to do
    if (root.dataset.intro !== "playing") return;
    const controls = animate(progress, 100, { duration: 1.25, ease: [0.65, 0, 0.35, 1] });
    const tExit = setTimeout(() => setPhase("exit"), 1450);
    // Let the hero start revealing while the curtain is still lifting
    const tReady = setTimeout(releaseIntro, 1850);
    const tDone = setTimeout(() => {
      root.dataset.intro = "done";
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
      setPhase("done");
    }, 2500);
    return () => {
      controls.stop();
      clearTimeout(tExit);
      clearTimeout(tReady);
      clearTimeout(tDone);
    };
  }, [progress]);

  if (phase === "done") return null;
  const exiting = phase === "exit";

  return (
    <div className="intro-overlay fixed inset-0 z-[200] pointer-events-none" aria-hidden="true">
      {/* Back layer — navy, lifts slightly after the front */}
      <motion.div
        className="absolute inset-0 bg-[var(--brand-navy-900)]"
        initial={{ y: 0 }}
        animate={{ y: exiting ? "-100%" : 0 }}
        transition={{ duration: 0.85, ease: EASE_CURTAIN, delay: exiting ? 0.14 : 0 }}
      />

      {/* Front layer — white, with the brand mark */}
      <motion.div
        className="absolute inset-0 bg-white flex items-center justify-center blueprint-bg"
        initial={{ y: 0 }}
        animate={{ y: exiting ? "-100%" : 0 }}
        transition={{ duration: 0.8, ease: EASE_CURTAIN }}
      >
        <motion.div
          className="flex flex-col items-center"
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? -24 : 0 }}
          transition={{ duration: 0.4, ease: "easeIn" }}
        >
          {/* Node graph */}
          <svg viewBox="0 0 104 76" className="w-24 h-[70px] mb-6 overflow-visible">
            {EDGES.map(([a, b], i) => (
              <motion.line
                key={i}
                x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                stroke="var(--brand-navy-700)"
                strokeWidth={1.2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.55 }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: "easeOut" }}
              />
            ))}
            {NODES.map((n, i) => (
              <motion.circle
                key={i}
                cx={n.x} cy={n.y}
                r={i === 3 ? 5 : 3.6}
                fill={i === 3 ? "var(--brand-blue)" : "var(--brand-navy-700)"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.05 + i * 0.08 }}
              />
            ))}
          </svg>

          {/* Logo wipe */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
          >
            <Image src="/atalitixlogo.png" alt="" width={240} height={64} priority className="h-12 w-auto" />
          </motion.div>

          {/* Progress */}
          <div className="mt-8 flex items-center gap-4">
            <div className="relative h-px w-40 bg-slate-200 overflow-hidden">
              <motion.div className="absolute inset-0 origin-left bg-[var(--brand-blue)]" style={{ scaleX: barScale }} />
            </div>
            <motion.span className="font-mono text-[11px] tabular-nums text-slate-500 w-7">{pct}</motion.span>
          </div>
          <motion.p
            className="mt-3 font-mono text-[10.5px] tracking-[0.3em] uppercase text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Süreç · Sistem · Karar
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
