"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const word: Variants = {
  hidden: { y: "105%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE_OUT } },
};

/** Wraps every word of the given children in its own mask; keeps inline elements like <em>. */
function splitWords(node: React.ReactNode, keyPrefix = "w"): React.ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) =>
      /^\s+$/.test(part) || part === "" ? (
        part
      ) : (
        <span key={`${keyPrefix}-${i}`} className="inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em]">
          <motion.span className="inline-block will-change-transform" variants={word}>
            {part}
          </motion.span>
        </span>
      ),
    );
  }
  if (Array.isArray(node)) return node.map((n, i) => <React.Fragment key={`${keyPrefix}-${i}`}>{splitWords(n, `${keyPrefix}-${i}`)}</React.Fragment>);
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return React.cloneElement(node, undefined, splitWords(node.props.children, `${keyPrefix}-c`));
  }
  return node;
}

/**
 * Headline that rises word by word when scrolled into view.
 * Accepts plain text or inline markup (e.g. <em>), e.g.
 *   <WordReveal as="h2" className="section-title">ERP kararı <em>süreç</em> ile verilir.</WordReveal>
 */
export function WordReveal({
  children,
  as = "h2",
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
    >
      {splitWords(children)}
    </Tag>
  );
}

/** Plain text from a stored rich-text value (for DB headings shown with WordReveal). */
export function plainText(html: string | null | undefined): string {
  return (html ?? "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
}
