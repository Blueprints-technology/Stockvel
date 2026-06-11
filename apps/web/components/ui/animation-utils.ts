import { Variants, Transition } from "framer-motion";

// ─── Safe Animation Utilities ───────────────────────────────────────────────

/** Safe tween transition for blur animations — never produces negative values */
export const blurTransition: Transition = {
  type: "tween",
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

/** Standard spring transition for opacity/transform only — safe with these properties */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.8,
};

/** Softer spring for hover/tap interactions */
export const popTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

/** Reduced motion fallback — instant or near-instant */
export const reducedTransition: Transition = {
  duration: 0.15,
};

// ─── Page-Level Variants ──────────────────────────────────────────────────────

export const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.02,
      when: "beforeChildren",
    },
  },
};

export const reducedPageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
};

// ─── Block-Level Variants ─────────────────────────────────────────────────────

/**
 * Block entrance with blur — uses TWEEN (not spring) to avoid negative blur values
 * This is the key fix for: "Invalid keyframe value for property filter: blur(-Xpx)"
 */
export const blurBlockVariants: Variants = {
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
    transition: blurTransition,
  },
};

/**
 * Block entrance without blur — can safely use spring for snappier feel
 * Use this when you don't need the blur aesthetic
 */
export const springBlockVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
};

/** Minimal reduced-motion variant */
export const reducedBlockVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: reducedTransition,
  },
};

// ─── Directional Slide Variants ───────────────────────────────────────────────

export function createSlideVariants(from: "left" | "right" | "top" | "bottom"): Variants {
  const directions = {
    left: { x: -32, y: 0 },
    right: { x: 32, y: 0 },
    top: { x: 0, y: -32 },
    bottom: { x: 0, y: 32 },
  };

  return {
    hidden: { opacity: 0, ...directions[from] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 26,
        mass: 0.9,
      },
    },
  };
}

export const reducedSlideVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: reducedTransition,
  },
};

// ─── Hover/Tap Variants ───────────────────────────────────────────────────────

export const cardHoverVariants = {
  y: -4,
  scale: 1.01,
  boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
  transition: popTransition,
};

export const cardTapVariants = {
  scale: 0.98,
};

// ─── Number Counter Variant ───────────────────────────────────────────────────

export const numberVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};