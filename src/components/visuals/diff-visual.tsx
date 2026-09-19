"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";

export function DiffVisual({ diff }: { diff: { value: number; label: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const max = Math.max(...diff.map((d) => d.value));

  return (
    <div ref={ref} className="grid gap-3 md:grid-cols-[1fr_1fr]">
      <div className="rounded-lg border border-line bg-bg/60 p-3">
        <p className="mb-3 font-mono text-[10.5px] text-fg-dim">git diff --stat · legacy workflow engine</p>
        <ul className="space-y-2.5">
          {diff.map((d, i) => (
            <li key={d.label} className="grid grid-cols-[64px_1fr] items-center gap-3 font-mono text-[12px]">
              <span className="text-rose">
                −<NumberTicker value={d.value} delay={0.2 + i * 0.1} className="tracking-normal text-rose" />
              </span>
              <div className="relative h-2 overflow-hidden rounded-full bg-line">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${Math.max(8, (d.value / max) * 100)}%` } : {}}
                  transition={{ delay: 0.2 + i * 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-rose/40 to-rose"
                />
              </div>
              <span className="col-start-2 -mt-1.5 text-[10.5px] text-fg-dim">{d.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-line bg-bg/60 p-3 font-mono text-[11px] leading-relaxed">
        <p className="mb-2 text-[10.5px] text-fg-dim">one transactional migration</p>
        {[
          { t: "BEGIN;", c: "text-violet" },
          { t: "DROP TABLE …        -- ×9", c: "text-rose" },
          { t: "DROP FUNCTION …     -- ×9", c: "text-rose" },
          { t: "COMMIT;", c: "text-violet" },
        ].map((l, i) => (
          <motion.p
            key={l.t}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 + i * 0.25 }}
            className={l.c}
          >
            {l.t}
          </motion.p>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8 }}
          className="mt-3 rounded-md border border-amber/25 bg-amber/10 px-2.5 py-1.5 text-amber"
        >
          ADR: 150 defects + safe-deletion rules
        </motion.div>
      </div>
    </div>
  );
}
