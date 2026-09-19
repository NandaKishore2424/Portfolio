"use client";

/*
 * Adapted from "Inversion Circle Scroll Animation" by ajith66310 on 21st.dev (MIT):
 * https://21st.dev/@ajith66310/components/inversion-circle-scroll-animation
 * Changes: driven by the page scroll (Lenis-friendly) instead of a nested
 * scroll container, motion values instead of per-scroll React renders, a
 * third phase that collapses the circle back into a "packet", site palette,
 * and a static fallback for reduced motion.
 */

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";

const BALL = 300; // px, diameter while rising (capped at 64vw)

const inOutQuart = (p: number) => (p < 0.5 ? 8 * p ** 4 : 1 - (-2 * p + 2) ** 4 / 2);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

type CopyProps = { kicker: ReactNode; title: ReactNode; subtitle?: ReactNode; tone: "light" | "dark" };

function Copy({ kicker, title, subtitle, tone }: CopyProps) {
  const light = tone === "light";
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <p className={light ? "font-mono text-[12px] text-green" : "font-mono text-[12px] text-[#0b5f43]"}>{kicker}</p>
      <p
        className={
          "mt-5 max-w-4xl text-[clamp(2.4rem,7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em] " +
          (light ? "text-fg" : "text-[#05070b]")
        }
      >
        {title}
      </p>
      {subtitle ? <p className={"mt-5 text-lg " + (light ? "text-fg-muted" : "text-[#1d2735]")}>{subtitle}</p> : null}
    </div>
  );
}

export function InversionCircle({
  kicker,
  title,
  subtitle,
}: {
  kicker: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  // SSR-safe: false during hydration, the real preference right after.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  // Phase 1 (0 → .38): the circle rises to the centre.
  // Phase 2 (.38 → .7): it grows until it covers the viewport.
  // Phase 3 (.78 → 1): it collapses into a small packet that drops toward the form.
  const rise = useTransform(scrollYProgress, (v) => inOutQuart(clamp(v / 0.38)));
  const grow = useTransform(scrollYProgress, (v) => clamp((v - 0.38) / 0.32) ** 2);
  const shrink = useTransform(scrollYProgress, (v) => {
    const p = clamp((v - 0.78) / 0.22);
    return p * p * (3 - 2 * p);
  });

  // Geometry is expressed in CSS units so the server and the client render the
  // same first frame. The rising disc is 300px, or 64vw on narrow screens.
  const ballFactor = useTransform(() => (1 - grow.get()) * (1 - shrink.get()));
  const packetPx = useTransform(() => shrink.get() * 14);
  const packetHalfPx = useTransform(() => shrink.get() * 7);
  const coverVmax = useTransform(() => grow.get() * 150 * (1 - shrink.get()));
  const coverHalfVmax = useTransform(() => grow.get() * 75 * (1 - shrink.get()));
  const below = useTransform(() => 1 - rise.get());
  const dropVh = useTransform(() => (1 - rise.get()) * 50 + shrink.get() * 42);

  const size = useMotionTemplate`calc(min(${BALL}px, 64vw) * ${ballFactor} + ${packetPx}px + ${coverVmax}vmax)`;
  const offset = useMotionTemplate`calc(${dropVh}vh + min(${BALL / 2}px, 32vw) * ${below})`;
  const clip = useMotionTemplate`circle(calc(min(${BALL / 2}px, 32vw) * ${ballFactor} + ${packetHalfPx}px + ${coverHalfVmax}vmax) at 50% calc(50% + ${offset}))`;
  const ballTransform = useMotionTemplate`translate(-50%, calc(-50% + ${offset}))`;
  const hint = useTransform(() => {
    const v = scrollYProgress.get();
    return v < 0.55 || v > 0.8 ? 0 : v < 0.7 ? (v - 0.55) / 0.15 : 1 - (v - 0.7) / 0.1;
  });

  if (reduced) {
    return (
      <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center md:px-8">
        <p className="font-mono text-[12px] text-green">{kicker}</p>
        <p className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{title}</p>
        {subtitle ? <p className="mt-4 text-fg-muted">{subtitle}</p> : null}
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative z-10 h-[260svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(5,7,11,0.55),rgba(5,7,11,0.92)_70%)]">
        {/* the disc */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4f8fc,#dfe7f1_55%,#b9f5ea)] shadow-[0_0_80px_rgba(94,234,212,0.35)]"
          style={{ width: size, height: size, transform: ballTransform }}
        />
        {/* light copy, visible outside the disc */}
        <div className="absolute inset-0">
          <Copy kicker={kicker} title={title} subtitle={subtitle} tone="light" />
        </div>
        {/* dark copy, clipped to the disc: the inversion */}
        <motion.div aria-hidden className="absolute inset-0" style={{ clipPath: clip, WebkitClipPath: clip }}>
          <Copy kicker={kicker} title={title} subtitle={subtitle} tone="dark" />
        </motion.div>
        <motion.p
          style={{ opacity: hint }}
          className="absolute inset-x-0 bottom-10 text-center font-mono text-[11px] text-[#1d2735]"
        >
          keep scrolling: the response is on its way down ↓
        </motion.p>
      </div>
    </div>
  );
}
