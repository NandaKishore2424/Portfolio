"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { MethodBadge } from "@/components/method-badge";
import { cn } from "@/lib/utils";

export function SectionHeading({
  method,
  path,
  index,
  title,
  accent,
  lede,
  className,
}: {
  method: string;
  path: string;
  index: string;
  title: ReactNode;
  accent?: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-12 md:mb-16", className)}>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 font-mono text-xs"
      >
        <MethodBadge method={method} />
        <span className="text-fg-muted">{path}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="h-px flex-1 origin-left bg-gradient-to-r from-line-strong via-line to-transparent"
        />
        <span className="text-fg-dim">{index}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-balance md:text-6xl"
      >
        {title}{" "}
        {accent ? <span className="font-serif font-normal italic tracking-normal text-fg-muted">{accent}</span> : null}
      </motion.h2>
      {lede ? (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted text-pretty md:text-lg"
        >
          {lede}
        </motion.p>
      ) : null}
    </header>
  );
}
