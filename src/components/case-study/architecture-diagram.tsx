"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { ArchEdge, ArchNode } from "@/content/projects";
import { cn } from "@/lib/utils";

const toneColor: Record<ArchNode["tone"], string> = {
  neutral: "#dfe7f1",
  teal: "#5eead4",
  amber: "#fbbf24",
  violet: "#a78bfa",
  blue: "#60a5fa",
  rose: "#fb7185",
};

type Size = { w: number; h: number };

function edgePath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // Mostly-horizontal links bend horizontally; mostly-vertical ones bend vertically.
  if (Math.abs(dx) >= Math.abs(dy)) {
    const c = dx * 0.5;
    return `M ${a.x} ${a.y} C ${a.x + c} ${a.y}, ${b.x - c} ${b.y}, ${b.x} ${b.y}`;
  }
  const c = dy * 0.5;
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + c}, ${b.x} ${b.y - c}, ${b.x} ${b.y}`;
}

export function ArchitectureDiagram({
  nodes,
  edges,
  caption,
  bare = false,
}: {
  nodes: ArchNode[];
  edges: ArchEdge[];
  caption: string;
  bare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  const [hover, setHover] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pos = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    for (const n of nodes) map[n.id] = { x: (n.x / 100) * size.w, y: (n.y / 100) * size.h };
    return map;
  }, [nodes, size]);

  const connected = (e: ArchEdge) => hover === e.from || hover === e.to;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <figure>
      {/* Wide screens: positioned diagram */}
      <div className={cn("hidden md:block", bare ? "bg-[#0b1019] p-5" : "rounded-3xl border border-line bg-[#0b1019]/90 p-6")}>
        <div ref={ref} className="grid-bg relative aspect-[16/7] w-full rounded-2xl">
          {size.w > 0 ? (
            <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              {edges.map((e, i) => {
                const d = edgePath(pos[e.from], pos[e.to]);
                const color = toneColor[byId[e.to].tone];
                const lit = hover ? connected(e) : true;
                return (
                  <g key={`${e.from}-${e.to}`} style={{ opacity: lit ? 1 : 0.18, transition: "opacity 300ms" }}>
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeOpacity={0.45}
                      strokeWidth={1.5}
                      strokeDasharray={e.dashed ? "5 6" : undefined}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <circle r={3.5} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
                      <animateMotion dur={`${2.6 + i * 0.35}s`} repeatCount="indefinite" path={d} />
                    </circle>
                    {e.label ? (
                      <foreignObject
                        x={(pos[e.from].x + pos[e.to].x) / 2 - 70}
                        y={(pos[e.from].y + pos[e.to].y) / 2 - 11}
                        width={140}
                        height={22}
                        className="overflow-visible"
                      >
                        <div className="flex justify-center">
                          <span className="whitespace-nowrap rounded-md border border-line bg-[#0b1019] px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                            {e.label}
                          </span>
                        </div>
                      </foreignObject>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          ) : null}

          {nodes.map((n, i) => {
            const color = toneColor[n.tone];
            const dim = hover && hover !== n.id && !edges.some((e) => (e.from === hover && e.to === n.id) || (e.to === hover && e.from === n.id));
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                className={cn(
                  "absolute w-[168px] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-[#0b1019] px-3 py-2.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.8)] transition-opacity duration-300 lg:w-[180px]",
                  dim ? "opacity-40" : "opacity-100",
                )}
                style={{ left: `${n.x}%`, top: `${n.y}%`, borderColor: `${color}55` }}
              >
                <p className="flex items-center gap-2 text-[13px] font-medium">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
                  {n.label}
                </p>
                <p className="mt-0.5 font-mono text-[10.5px] leading-snug text-fg-muted">{n.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Narrow screens: the same graph as an ordered list */}
      <ol className="space-y-2 md:hidden">
        {nodes.map((n) => {
          const out = edges.filter((e) => e.from === n.id);
          const color = toneColor[n.tone];
          return (
            <li key={n.id} className="rounded-xl border bg-[#0b1019] p-3" style={{ borderColor: `${color}44` }}>
              <p className="flex items-center gap-2 text-sm font-medium">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {n.label}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-fg-muted">{n.detail}</p>
              {out.length ? (
                <ul className="mt-2 space-y-1 border-t border-line pt-2 font-mono text-[11px] text-fg-muted">
                  {out.map((e) => (
                    <li key={e.to}>
                      → {byId[e.to].label}
                      {e.label ? <span className="text-fg-dim"> · {e.label}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-3 text-[13px] text-fg-muted">{caption}</figcaption>
    </figure>
  );
}
