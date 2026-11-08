"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Masked line reveal: the line rises from behind an invisible edge.
 * `show` controls when it plays; `instant` renders static (editor mode).
 */
export function MaskLine({ children, show, delay = 0, instant = false }: { children: React.ReactNode; show: boolean; delay?: number; instant?: boolean }) {
  if (instant) return <span className="block">{children}</span>;
  return (
    <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        animate={show ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 1.05, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Same mask reveal, triggered when scrolled into view.
 * The observer sits on the outer (unclipped) wrapper — the inner block starts clipped.
 */
export function InViewMask({ children, delay = 0, instant = false, className = "" }: { children: React.ReactNode; delay?: number; instant?: boolean; className?: string }) {
  if (instant) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={`overflow-hidden pb-[0.14em] -mb-[0.14em] ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div variants={{ hidden: { y: "105%" }, visible: { y: "0%", transition: { duration: 1, delay, ease: EASE_OUT } } }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** A hairline that draws itself from the left when it enters the viewport. */
export function DrawRule({ className = "", delay = 0, dark = false, instant = false }: { className?: string; delay?: number; dark?: boolean; instant?: boolean }) {
  const color = dark ? "bg-white/15" : "bg-[var(--rule)]";
  if (instant) return <div className={`h-px ${color} ${className}`} />;
  return (
    <motion.div
      className={`h-px origin-left ${color} ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
    />
  );
}

/** Gentle fade + rise, once. */
export function FadeIn({ children, delay = 0, className = "", instant = false }: { children: React.ReactNode; delay?: number; className?: string; instant?: boolean }) {
  if (instant) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
