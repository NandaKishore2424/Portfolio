"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// SQL statements per request for a small vs a large tenant, before and after
// each N+1 fix. Colors validated for the dark surface (dataviz validator).
const SERIES = {
  before: { label: "before fix", color: "#d95926" },
  after: { label: "after fix", color: "#199e70" },
} as const;

const rows = [
  { path: "GET /student/batches", fix: "page-level bulk loads", before: [10, 28], after: [5, 5] },
  { path: "GET /trainer/batches", fix: "one grouped count", before: [4, 13], after: [2, 2] },
  { path: "GET /batches/{id}/syllabus", fix: "a second bulk query", before: [6, 18], after: [3, 3] },
] as const;

const W = 260;
const H = 190;
const PAD = { top: 16, right: 44, bottom: 30, left: 30 };
const Y_MAX = 30;
const TICKS = [0, 10, 20, 30];
const xAt = (i: number) => PAD.left + i * (W - PAD.left - PAD.right);
const yAt = (v: number) => PAD.top + (1 - v / Y_MAX) * (H - PAD.top - PAD.bottom);
const TENANT = ["small tenant", "large tenant"];

type Hover = { row: number; key: keyof typeof SERIES; i: number } | null;

function Multiple({ row, index, hover, setHover }: { row: (typeof rows)[number]; index: number; hover: Hover; setHover: (h: Hover) => void }) {
  return (
    <figure className="min-w-0">
      <figcaption className="mb-2">
        <p className="truncate font-mono text-[12px] text-fg">{row.path}</p>
        <p className="text-[11.5px] text-fg-muted">fixed with {row.fix}</p>
      </figcaption>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="img" aria-label={`${row.path}: before ${row.before[0]} to ${row.before[1]} statements, after ${row.after[0]} to ${row.after[1]}`}>
          {TICKS.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={yAt(t)} y2={yAt(t)} stroke="rgb(148 163 184 / 0.14)" strokeWidth={1} />
              <text x={PAD.left - 8} y={yAt(t)} textAnchor="end" dominantBaseline="middle" className="fill-[#7f8b9e] font-mono text-[10px] tabular-nums">
                {t}
              </text>
            </g>
          ))}
          {TENANT.map((label, i) => (
            <text key={label} x={xAt(i)} y={H - 8} textAnchor={i === 0 ? "start" : "end"} className="fill-[#7f8b9e] font-mono text-[10px]">
              {label}
            </text>
          ))}

          {(Object.keys(SERIES) as (keyof typeof SERIES)[]).map((key) => {
            const s = SERIES[key];
            const values = row[key];
            return (
              <g key={key}>
                <motion.line
                  x1={xAt(0)}
                  y1={yAt(values[0])}
                  x2={xAt(1)}
                  y2={yAt(values[1])}
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 1, delay: 0.15 * index + (key === "after" ? 0.4 : 0), ease: [0.22, 1, 0.36, 1] }}
                />
                {values.map((v, i) => {
                  const active = hover?.row === index && hover.key === key && hover.i === i;
                  return (
                    <g key={i}>
                      <circle cx={xAt(i)} cy={yAt(v)} r={active ? 6 : 4} fill={s.color} stroke="#0b1019" strokeWidth={2} />
                      <circle
                        cx={xAt(i)}
                        cy={yAt(v)}
                        r={13}
                        fill="transparent"
                        tabIndex={0}
                        role="img"
                        aria-label={`${s.label}, ${TENANT[i]}: ${v} statements`}
                        className="cursor-pointer outline-none"
                        onPointerEnter={() => setHover({ row: index, key, i })}
                        onPointerLeave={() => setHover(null)}
                        onFocus={() => setHover({ row: index, key, i })}
                        onBlur={() => setHover(null)}
                      />
                    </g>
                  );
                })}
                {/* Direct label on the large-tenant end only */}
                <text
                  x={xAt(1) + 10}
                  y={yAt(values[1])}
                  dominantBaseline="middle"
                  className="fill-[#e7edf5] font-mono text-[11px] font-semibold"
                >
                  {values[1]}
                </text>
              </g>
            );
          })}
        </svg>

        {hover?.row === index ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-line-strong bg-surface-solid px-2.5 py-1.5 shadow-xl"
            style={{
              left: `${(xAt(hover.i) / W) * 100}%`,
              top: `${(yAt(row[hover.key][hover.i]) / H) * 100}%`,
              marginTop: -12,
            }}
          >
            <p className="font-mono text-sm font-semibold text-fg">{row[hover.key][hover.i]} statements</p>
            <p className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-fg-muted">
              <span className="inline-block h-0.5 w-3 rounded" style={{ background: SERIES[hover.key].color }} />
              {SERIES[hover.key].label} · {TENANT[hover.i]}
            </p>
          </div>
        ) : null}
      </div>
    </figure>
  );
}

export function QueryBudgetChart() {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hover, setHover] = useState<Hover>(null);

  return (
    <div className="rounded-2xl border border-line bg-[#0b1019] p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">SQL statements per request</p>
          <p className="text-[12px] text-fg-muted">A fixed read path should cost the same for a small tenant and a large one.</p>
        </div>
        <div className="inline-flex rounded-lg border border-line p-0.5 font-mono text-[11px]">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn("rounded-md px-2.5 py-1 transition", view === v ? "bg-surface-hover text-fg" : "text-fg-muted hover:text-fg")}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "chart" ? (
        <>
          <div className="mt-3 flex items-center gap-4 text-[12px] text-fg-muted">
            {Object.values(SERIES).map((s) => (
              <span key={s.label} className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 rounded" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {rows.map((row, i) => (
              <Multiple key={row.path} row={row} index={i} hover={hover} setHover={setHover} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 overflow-x-auto" data-lenis-prevent>
          <table className="w-full min-w-[520px] text-left text-[12.5px]">
            <thead className="font-mono text-[11px] text-fg-muted">
              <tr className="border-b border-line">
                <th className="py-2 pr-3 font-normal">read path</th>
                <th className="py-2 pr-3 text-right font-normal">before · small</th>
                <th className="py-2 pr-3 text-right font-normal">before · large</th>
                <th className="py-2 pr-3 text-right font-normal">after · small</th>
                <th className="py-2 pr-3 text-right font-normal">after · large</th>
                <th className="py-2 font-normal">fix</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.path} className="border-b border-line last:border-0">
                  <td className="py-2 pr-3 font-mono">{r.path}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{r.before[0]}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{r.before[1]}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{r.after[0]}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{r.after[1]}</td>
                  <td className="py-2 text-fg-muted">{r.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-[11.5px] leading-relaxed text-fg-muted">
        Before counts come from the project&apos;s performance-budget log; after counts are from the current query-efficiency suite. The two runs used
        different fixture sizes, so read each line as flat or growing, not as a like-for-like comparison.
      </p>
    </div>
  );
}
