"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// Scroll-linked word reveal (in the spirit of Magic UI's TextReveal), without
// the tall sticky wrapper: words light up as the paragraph crosses the viewport.

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blur = useTransform(progress, range, ["blur(3px)", "blur(0px)"]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity, filter: blur }} className={cn(highlight && "text-teal")}>
        {children}
      </motion.span>
    </span>
  );
}

export function ScrollWords({
  text,
  highlights = [],
  className,
}: {
  text: string;
  highlights?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  const marks = new Set(highlights.map((h) => h.toLowerCase()));

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="contents">
        {words.map((word, i) => {
          // Keep offsets inside [0, 1]; motion may hand them to a native ScrollTimeline.
          const start = Math.min(1, i / words.length);
          const end = Math.min(1, (i + 1) / words.length);
          const bare = word.replace(/[^\w/.-]/g, "").toLowerCase();
          return (
            <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]} highlight={marks.has(bare)}>
              {word}
            </Word>
          );
        })}
      </span>
    </p>
  );
}
