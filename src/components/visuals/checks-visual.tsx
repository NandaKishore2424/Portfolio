"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check, ShieldCheck } from "lucide-react";

export function ChecksVisual({ checks, tests }: { checks: string[]; tests: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="grid gap-3">
      <ul className="grid gap-1.5">
        {checks.map((c, i) => (
          <motion.li
            key={c}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25 + i * 0.35, duration: 0.4 }}
            className="flex items-start gap-2.5 rounded-lg border border-line bg-bg/60 px-3 py-2 text-[13px]"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.45 + i * 0.35, type: "spring", stiffness: 400, damping: 18 }}
              className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-green/15 text-green"
            >
              <Check className="h-3 w-3" />
            </motion.span>
            <span className="text-fg-muted">{c}</span>
          </motion.li>
        ))}
      </ul>

      <div className="rounded-lg border border-line bg-bg/60 p-3 font-mono text-[11px]">
        <div className="flex items-center justify-between text-fg-dim">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-green" /> test run
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 2.4 }}
            className="text-green"
          >
            {tests} new tests · passing
          </motion.span>
        </div>
        <div className="mt-2 flex gap-[3px]">
          {Array.from({ length: tests }, (_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.12 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 + i * 0.035 }}
              className={i === tests - 1 ? "h-3 flex-1 rounded-[2px] bg-violet" : "h-3 flex-1 rounded-[2px] bg-green/80"}
              title={i === tests - 1 ? "concurrency regression" : undefined}
            />
          ))}
        </div>
        <p className="mt-2 text-fg-dim">
          <span className="text-violet">■</span> includes a concurrency regression test
        </p>
      </div>
    </div>
  );
}
