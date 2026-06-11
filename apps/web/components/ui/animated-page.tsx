"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  blurBlockVariants,
  cardHoverVariants,
  cardTapVariants,
  createSlideVariants,
  numberVariants,
  pageVariants,
  reducedBlockVariants,
  reducedPageVariants,
  reducedSlideVariants,
  springBlockVariants,
} from "@/components/ui/animation-utils";

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
      variants={shouldReduce ? reducedPageVariants : pageVariants}
      initial="hidden"
      animate="show"
      className={cn("space-y-6", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Block-level entrance animation.
 *
 * @param useBlur — Whether to include the blur filter effect. Defaults to `true`.
 *   When `true`, uses a tween transition to prevent negative blur values.
 *   When `false`, uses a spring transition for a snappier feel on opacity/transform only.
 */
export function AnimatedBlock({
  children,
  className,
  delay = 0,
  useBlur = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  useBlur?: boolean;
}) {
  const shouldReduce = useReducedMotion();

  const variants = shouldReduce
    ? reducedBlockVariants
    : useBlur
      ? blurBlockVariants
      : springBlockVariants;

  return (
    <motion.div
      variants={variants}
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
      whileHover={cardHoverVariants}
      whileTap={cardTapVariants}
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

  return (
    <motion.div
      variants={shouldReduce ? reducedSlideVariants : createSlideVariants(from)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
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
      variants={numberVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {value}
    </motion.span>
  );
}
