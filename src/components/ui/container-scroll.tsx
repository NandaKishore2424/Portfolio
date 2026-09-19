"use client";

/*
 * Adapted from Aceternity UI's "Container Scroll Animation" (also on 21st.dev):
 * a framed card that tilts back in 3D and settles flat as it scrolls into view.
 * Restyled for this site; the title slot is optional.
 */

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";

export function ContainerScroll({ title, children }: { title?: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // SSR-safe: false during hydration, the real preference right after.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });

  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : mobile ? [0.92, 1] : [1.06, 1]);
  const lift = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, 0]);

  return (
    <div ref={ref} className="relative" style={{ perspective: "1200px" }}>
      {title ? <motion.div style={{ y: lift }}>{title}</motion.div> : null}
      <motion.div
        style={{
          rotateX: rotate,
          scale,
          transformOrigin: "50% 0%",
          boxShadow:
            "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a",
        }}
        className="mx-auto w-full rounded-[28px] border border-line-strong bg-[linear-gradient(180deg,#141b28,#0b1019)] p-2 md:p-3"
      >
        <div className="flex items-center gap-1.5 px-3 pb-2 pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
          <span className="ml-3 font-mono text-[10.5px] text-fg-muted">architecture.svg</span>
        </div>
        <div className="overflow-hidden rounded-[20px]">{children}</div>
      </motion.div>
    </div>
  );
}
