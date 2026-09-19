"use client";

import { motion } from "motion/react";

/** A trace-log line between sections: the request moving to its next hop. */
export function HopDivider({
  span,
  total = 7,
  service,
  message,
  tone = "text-teal",
}: {
  span: number;
  total?: number;
  service: string;
  message: string;
  tone?: string;
}) {
  return (
    <div aria-hidden className="relative z-10 mx-auto max-w-6xl px-5 py-8 md:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 overflow-hidden font-mono text-[11px] text-fg-dim"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-teal/60" />
          <span className="relative h-2 w-2 rounded-full bg-teal" />
        </span>
        <span className="shrink-0">
          span {span}/{total}
        </span>
        <span className={`shrink-0 ${tone}`}>[{service}]</span>
        <span className="truncate text-fg-muted">{message}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-px min-w-8 flex-1 origin-left bg-gradient-to-r from-line-strong to-transparent"
        />
      </motion.div>
    </div>
  );
}
