"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useMotionValue, useReducedMotion } from "framer-motion";

/** Thin brand-blue reading progress bar fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-[var(--brand-blue)]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

/** Pulls its child slightly toward the cursor. Inline-block wrapper. */
export function Magnetic({ children, strength = 0.22, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.span ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.span>
  );
}

/**
 * Masked line reveal: the line slides up from behind an invisible edge.
 * `show` controls when it plays; `instant` renders static (editor mode).
 */
export function MaskLine({ children, show, delay = 0, instant = false }: { children: React.ReactNode; show: boolean; delay?: number; instant?: boolean }) {
  if (instant) return <span className="block">{children}</span>;
  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "115%" }}
        animate={show ? { y: "0%" } : { y: "115%" }}
        transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Same mask reveal, triggered when scrolled into view.
 * The observer sits on the outer (unclipped) wrapper — the inner span starts clipped.
 */
export function InViewMask({ children, delay = 0, instant = false, className = "" }: { children: React.ReactNode; delay?: number; instant?: boolean; className?: string }) {
  if (instant) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={`overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div
        variants={{ hidden: { y: "105%" }, visible: { y: "0%", transition: { duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] } } }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
