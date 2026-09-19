"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Bot, FileText, GitBranch, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const pipelineNodes = [
  { id: "doc_processing", desc: "extract text · OCR fallback" },
  { id: "clinical_extract", desc: "prose → diagnoses, procedures", llm: true },
  { id: "cpt_resolve", desc: "procedures → CPT/HCPCS" },
  { id: "snomed_resolve", desc: "WHO ICD-11 API · SNOMED" },
  { id: "snomed_icd_map", desc: "crosswalk → ICD-10-CM", branch: true },
  { id: "icd_embedding", desc: "pgvector fallback", optional: true },
  { id: "icd_decision", desc: "deterministic scoring", core: true },
  { id: "audit_comparison", desc: "AI vs human coder" },
  { id: "financial_calc", desc: "org pricing → estimate" },
  { id: "risk_scoring", desc: "risk label · persist" },
] as const;

type Run = "direct" | "fallback";

/** A note travels through the 10-node LangGraph pipeline; runs alternate between both branches. */
export function PipelineVisual({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const [tick, setTick] = useState(0);

  // One counter drives both runs: the direct path (9 nodes) then the fallback path (10 nodes).
  const directLen = pipelineNodes.length - 1;
  const cycleDirect = directLen + 5;
  const cycleFallback = pipelineNodes.length + 5;
  const t = tick % (cycleDirect + cycleFallback);
  const run: Run = t < cycleDirect ? "direct" : "fallback";
  const step = run === "direct" ? t - 1 : t - cycleDirect - 1;

  const path = pipelineNodes
    .map((n, i) => ({ ...n, i }))
    .filter((n) => !(run === "direct" && "optional" in n && n.optional));

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setTick((v) => v + 1), 520);
    return () => clearInterval(id);
  }, [inView]);

  const currentIndex = step >= 0 && step < path.length ? path[step].i : step >= path.length ? 99 : -1;
  const skipped = run === "direct";

  return (
    <div ref={ref} className="rounded-2xl border border-line bg-bg/70 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
        <span className="flex items-center gap-1.5 text-fg-dim">
          <FileText className="h-3.5 w-3.5 text-fg-muted" /> discharge_summary.pdf → /code/run
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={run}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={cn("rounded-md border px-1.5 py-0.5", skipped ? "border-teal/30 text-teal" : "border-violet/30 text-violet")}
          >
            {skipped ? "candidates found upstream" : "no candidates yet → fallback"}
          </motion.span>
        </AnimatePresence>
      </div>

      <ol className={cn("relative mt-4", compact ? "space-y-1" : "space-y-1.5")}>
        {pipelineNodes.map((n, i) => {
          const isOptional = "optional" in n && n.optional;
          const isSkipped = isOptional && skipped;
          const passed = currentIndex > i && !isSkipped;
          const current = currentIndex === i;
          return (
            <li key={n.id} className={cn("relative", isOptional && "ml-6")}>
              {isOptional ? (
                <span className="absolute -left-4 top-1/2 h-px w-3 bg-line-strong" aria-hidden />
              ) : null}
              <motion.div
                animate={{
                  opacity: isSkipped ? 0.35 : 1,
                  borderColor: current
                    ? "llm" in n && n.llm
                      ? "rgba(251,113,133,0.6)"
                      : "rgba(94,234,212,0.6)"
                    : "rgba(148,163,184,0.12)",
                  backgroundColor: current ? "rgba(94,234,212,0.06)" : "rgba(5,7,11,0.5)",
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5"
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-md font-mono text-[10px] transition-colors",
                    passed ? "bg-teal/15 text-teal" : current ? "bg-teal text-bg" : "bg-surface-hover text-fg-dim",
                  )}
                >
                  {i + 1}
                </span>
                <span className={cn("truncate font-mono text-[11.5px]", "core" in n && n.core ? "text-teal" : "text-fg")}>
                  {n.id}
                </span>
                {!compact ? <span className="hidden truncate text-[11px] text-fg-dim sm:inline">{n.desc}</span> : null}
                <span className="ml-auto flex shrink-0 items-center gap-1">
                  {"llm" in n && n.llm ? (
                    <span className="flex items-center gap-1 rounded border border-rose/30 bg-rose/10 px-1.5 font-mono text-[9.5px] text-rose">
                      <Bot className="h-3 w-3" /> only LLM call
                    </span>
                  ) : null}
                  {"branch" in n && n.branch ? (
                    <span className="flex items-center gap-1 rounded border border-line px-1.5 font-mono text-[9.5px] text-fg-dim">
                      <GitBranch className="h-3 w-3" /> branch
                    </span>
                  ) : null}
                  {isOptional ? (
                    <span className={cn("rounded px-1.5 font-mono text-[9.5px]", isSkipped ? "text-fg-dim" : "text-violet")}>
                      {isSkipped ? "skipped" : "runs"}
                    </span>
                  ) : null}
                  {"core" in n && n.core ? (
                    <span className="rounded border border-teal/30 bg-teal/10 px-1.5 font-mono text-[9.5px] text-teal">no LLM</span>
                  ) : null}
                </span>
              </motion.div>
            </li>
          );
        })}
      </ol>

      <motion.div
        animate={{ opacity: currentIndex === 99 ? 1 : 0.25 }}
        className="mt-3 flex items-start gap-2 rounded-lg border border-green/25 bg-green/5 px-3 py-2 font-mono text-[11px]"
      >
        <UserCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />
        <span>
          <span className="block text-green">suggestion ready</span>
          <span className="block text-fg-muted">codes, rationale and a risk label; a person decides whether to submit a claim</span>
        </span>
      </motion.div>
    </div>
  );
}
