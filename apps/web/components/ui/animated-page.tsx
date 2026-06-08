"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Variants ────────────────────────────────────────────────────────────────

const pageVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.02,
      when: "beforeChildren",
    },
  },
};

const blockVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
      mass: 0.8,
    },
  },
};

const reducedVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
};

// ─── Components ──────────────────────────────────────────────────────────────

export function AnimatedPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduce ? reducedVariants : pageVariants}
      initial="hidden"
      animate="show"
      className={cn("space-y-6", className)}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedBlock({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduce ? reducedVariants : blockVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={delay ? { delay } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Extras ──────────────────────────────────────────────────────────────────

/** Wrap a card or panel for a hover lift + subtle shadow pop */
export function AnimatedCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
        boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
        transition: { type: "spring", stiffness: 400, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Fade + slide in from the side — useful for sidebars or drawers */
export function AnimatedSlide({
  children,
  className,
  from = "left",
}: {
  children: ReactNode;
  className?: string;
  from?: "left" | "right" | "top" | "bottom";
}) {
  const shouldReduce = useReducedMotion();

  const directions = {
    left: { x: -32, y: 0 },
    right: { x: 32, y: 0 },
    top: { x: 0, y: -32 },
    bottom: { x: 0, y: 32 },
  };

  return (
    <motion.div
      initial={
        shouldReduce ? { opacity: 0 } : { opacity: 0, ...directions[from] }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={
        shouldReduce
          ? { duration: 0.15 }
          : { type: "spring", stiffness: 280, damping: 26, mass: 0.9 }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Number counter animation — wrap stat values */
export function AnimatedNumber({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {value}
    </motion.span>
  );
}
