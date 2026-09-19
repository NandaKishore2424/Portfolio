"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "before" | "after";

type RaceCopy = {
  a: string;
  b: string;
  steps: Record<Mode, { a: string[]; b: string[]; result: string; ok: boolean }>;
  labels?: Record<Mode, string>;
};

const chartCopy: RaceCopy = {
  a: "save chart · request A",
  b: "save chart · request B",
  labels: { before: "read, then insert", after: "unique index + ON CONFLICT" },
  steps: {
    before: {
      a: ["SELECT … → none", "INSERT row", "COMMIT"],
      b: ["SELECT … → none", "INSERT row", "COMMIT"],
      result: "2 rows for one chart: duplicate",
      ok: false,
    },
    after: {
      a: ["INSERT … ON CONFLICT", "row inserted", "COMMIT"],
      b: ["INSERT … ON CONFLICT", "row updated", "COMMIT"],
      result: "1 row: the invariant lives in PostgreSQL",
      ok: true,
    },
  },
};

export const claimCopy: RaceCopy = {
  a: "approve claim · reviewer 1",
  b: "approve claim · reviewer 2",
  labels: { before: "check, then update", after: "optimistic lock" },
  steps: {
    before: {
      a: ["read status = pending", "UPDATE → approved", "200 OK"],
      b: ["read status = pending", "UPDATE → approved", "200 OK"],
      result: "approved twice",
      ok: false,
    },
    after: {
      a: ["adjudicate(claim, expected state)", "lock holds: row updated", "200 OK"],
      b: ["adjudicate(claim, expected state)", "no match: already changed", "409 Conflict"],
      result: "one success, one 409 Conflict",
      ok: true,
    },
  },
};

function Lane({ title, steps, shown, tone }: { title: string; steps: string[]; shown: number; tone: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg/60 p-3">
      <p className="mb-2 flex items-center gap-2 font-mono text-[10.5px] text-fg-dim">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
        {title}
      </p>
      <ol className="space-y-1.5 font-mono text-[11px]">
        {steps.map((s, i) => (
          <motion.li
            key={`${s}-${i}`}
            initial={false}
            animate={{ opacity: i < shown ? 1 : 0.15, x: i < shown ? 0 : -4 }}
            transition={{ duration: 0.35 }}
            className={cn(
              "rounded px-2 py-1",
              i < shown ? "bg-surface-hover text-fg" : "text-fg-dim",
              s.includes("409") && i < shown && "text-rose",
            )}
          >
            {s}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function RaceRun({ copy, mode, active, onDone }: { copy: RaceCopy; mode: Mode; active: boolean; onDone: () => void }) {
  const [tick, setTick] = useState(0);
  const steps = copy.steps[mode];
  const done = tick >= 4;

  useEffect(() => {
    if (!active || done) return;
    const id = setInterval(() => setTick((t) => Math.min(t + 1, 4)), 650);
    return () => clearInterval(id);
  }, [active, done]);

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(onDone, 2600);
    return () => clearTimeout(id);
  }, [done, onDone]);

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        <Lane title={copy.a} steps={steps.a} shown={Math.min(tick, 3)} tone="var(--teal)" />
        <Lane title={copy.b} steps={steps.b} shown={Math.min(tick, 3)} tone="var(--blue)" />
      </div>
      <motion.div
        initial={false}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 6 }}
        className={cn(
          "mt-2 flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[11.5px]",
          steps.ok ? "border-green/30 bg-green/10 text-green" : "border-rose/30 bg-rose/10 text-rose",
        )}
      >
        {steps.ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        {steps.result}
      </motion.div>
    </>
  );
}

/** Two concurrent requests, replayed step by step, before and after the fix. */
export function RaceVisual({ copy = chartCopy }: { copy?: RaceCopy }) {
  const [mode, setMode] = useState<Mode>("before");
  const [run, setRun] = useState(0);
  const [manual, setManual] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });

  // Alternate automatically so the before/after story plays on its own.
  const onDone = useCallback(() => {
    if (!manual) setMode((m) => (m === "before" ? "after" : "before"));
  }, [manual]);

  return (
    <div ref={ref}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-line p-0.5 font-mono text-[11px]">
          {(["before", "after"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setManual(true);
                setMode(m);
                setRun((r) => r + 1);
              }}
              aria-pressed={mode === m}
              className={cn(
                "rounded-md px-2.5 py-1 transition",
                mode === m ? (m === "before" ? "bg-rose/15 text-rose" : "bg-green/15 text-green") : "text-fg-dim hover:text-fg",
              )}
            >
              {m}: {copy.labels?.[m]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="grid h-7 w-7 place-items-center rounded-md border border-line text-fg-dim transition hover:text-fg"
          aria-label="Replay"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <RaceRun key={`${mode}-${run}`} copy={copy} mode={mode} active={inView} onDone={onDone} />
    </div>
  );
}
