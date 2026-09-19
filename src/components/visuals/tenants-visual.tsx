"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const tenants = [
  { id: "A", color: "var(--teal)" },
  { id: "B", color: "var(--amber)" },
  { id: "C", color: "var(--violet)" },
];

const rows = [
  { t: "A", table: "appointments" },
  { t: "B", table: "appointments" },
  { t: "C", table: "charts" },
  { t: "A", table: "charts" },
  { t: "B", table: "invoices" },
  { t: "A", table: "prescriptions" },
  { t: "C", table: "invoices" },
  { t: "B", table: "charts" },
];

/** One schema, many hospitals: a policy filters every read to the caller's tenant. */
export function TenantsVisual() {
  const [active, setActive] = useState<string | null>("A");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (pinned) return;
    const id = setInterval(() => {
      setActive((cur) => {
        const order = ["A", "B", "C", null];
        return order[(order.indexOf(cur) + 1) % order.length];
      });
    }, 2200);
    return () => clearInterval(id);
  }, [pinned]);

  return (
    <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
      <div className="grid min-w-0 grid-cols-3 gap-2 sm:grid-cols-1">
        {tenants.map((t) => (
          <button
            key={t.id}
            type="button"
            onMouseEnter={() => {
              setPinned(true);
              setActive(t.id);
            }}
            onMouseLeave={() => setPinned(false)}
            onFocus={() => {
              setPinned(true);
              setActive(t.id);
            }}
            onBlur={() => setPinned(false)}
            className={cn(
              "flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left font-mono text-[11px] transition",
              active === t.id ? "border-line-strong bg-surface-hover text-fg" : "border-line text-fg-dim",
            )}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.color }} />
            <span className="truncate">
              <span className="hidden sm:inline">Hospital </span>
              {t.id}
            </span>
          </button>
        ))}
      </div>

      <div className="min-w-0 overflow-hidden rounded-lg border border-line bg-bg/60 font-mono text-[11px]">
        <div className="flex items-center justify-between border-b border-line px-3 py-2 text-fg-dim">
          <span>public.* · one PostgreSQL schema</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={active ?? "none"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className={active ? "text-green" : "text-fg-dim"}
            >
              {active ? `policy: tenant = ${active}` : "no session: all rows hidden"}
            </motion.span>
          </AnimatePresence>
        </div>
        <ul className="divide-y divide-line">
          {rows.map((r, i) => {
            const t = tenants.find((x) => x.id === r.t)!;
            const visible = active === r.t;
            return (
              <li key={i} className="relative flex items-center gap-3 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
                <span className={cn("w-24 transition-colors duration-500", visible ? "text-fg" : "text-fg-dim")}>{r.table}</span>
                <span className="text-fg-dim">
                  <span className="hidden sm:inline">tenant_id = </span>
                  {r.t}
                </span>
                <motion.span
                  className="absolute inset-0 bg-bg/80"
                  initial={false}
                  animate={{ opacity: visible ? 0 : 1 }}
                  transition={{ duration: 0.45 }}
                />
                {visible ? (
                  <motion.span
                    layoutId={`row-glow-${i}`}
                    className="absolute inset-y-0 left-0 w-0.5"
                    style={{ background: t.color }}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
