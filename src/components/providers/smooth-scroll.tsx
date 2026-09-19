"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

let lenisInstance: Lenis | null = null;

/** Scroll to an element or y-offset, smoothly when Lenis is running. */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: typeof target === "number" ? 0 : -72, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Lenis smooth scrolling on its own rAF loop. Disabled for reduced-motion
 * users, who get native scrolling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 0.95,
      anchors: { offset: -72 },
    });
    lenisInstance = lenis;

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // "user": honour prefers-reduced-motion for every motion animation (transforms
  // are skipped, opacity fades remain).
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
