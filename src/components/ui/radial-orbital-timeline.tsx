"use client";

/*
 * Adapted from "Radial Orbital Timeline" by Jatin Yadav on 21st.dev (MIT):
 * https://21st.dev/@jatin-yadav05/components/radial-orbital-timeline
 * Changes: site palette, rAF rotation that pauses off-screen and for reduced
 * motion, keyboard-accessible nodes, a side detail panel instead of a floating
 * card, and no demo-only "status/energy" fields.
 */

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrbitItem {
  id: number;
  title: string;
  kicker: string;
  content: string;
  icon: ComponentType<{ className?: string }>;
  tone: string;
  relatedIds: number[];
  href?: string;
  hrefLabel?: string;
}

export function RadialOrbitalTimeline({
  items,
  centerLabel,
  className,
}: {
  items: OrbitItem[];
  centerLabel: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [angle, setAngle] = useState(0);
  // Start small so the first paint never overflows a phone; the observer grows it.
  const [radius, setRadius] = useState(110);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "-80px" });
  const reduced = useReducedMotion();
  const rotating = activeId === null && inView && !reduced;

  // Size the orbit to the stage.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const size = Math.min(entry.contentRect.width, entry.contentRect.height);
      setRadius(Math.max(110, Math.min(210, size / 2 - 56)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Slow auto-rotation while nothing is selected.
  useEffect(() => {
    if (!rotating) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setAngle((a) => (a + dt * 0.006) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotating]);

  const select = useCallback(
    (id: number | null) => {
      const next = id === null || id === activeId ? null : id;
      setActiveId(next);
      if (next !== null) {
        // Rotate the chosen node to the top of the orbit.
        const index = items.findIndex((i) => i.id === next);
        setAngle(270 - (index / items.length) * 360);
      }
    },
    [activeId, items],
  );

  const active = items.find((i) => i.id === activeId) ?? null;
  const related = new Set(active?.relatedIds ?? []);

  return (
    <div className={cn("grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]", className)}>
      <div
        ref={stageRef}
        className="relative aspect-square w-full max-h-[560px] select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) select(null);
        }}
      >
        {/* orbit rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line"
          style={{ width: radius * 2, height: radius * 2 }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line/60"
          style={{ width: radius * 1.35, height: radius * 1.35 }}
        />

        {/* core */}
        <div className="absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-teal/40" />
          <span
            className="absolute inset-0 animate-pulse-ring rounded-full border border-violet/30"
            style={{ animationDelay: "1.2s" }}
          />
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[conic-gradient(from_180deg,#5eead4,#60a5fa,#a78bfa,#fbbf24,#5eead4)] p-[2px] shadow-[0_0_40px_rgba(94,234,212,0.35)]">
            <span className="grid h-full w-full place-items-center rounded-full bg-bg font-mono text-[13px] font-semibold">
              {centerLabel}
            </span>
          </span>
        </div>

        {items.map((item, index) => {
          const deg = ((index / items.length) * 360 + angle) % 360;
          const rad = (deg * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);
          const depth = (1 + Math.sin(rad)) / 2; // 0 = back (top), 1 = front (bottom)
          const isActive = item.id === activeId;
          const isRelated = related.has(item.id);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => select(item.id)}
              aria-pressed={isActive}
              aria-label={`${item.title}: ${item.kicker}`}
              className="group absolute left-1/2 top-1/2 outline-none"
              style={{
                transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                zIndex: isActive ? 50 : Math.round(20 + depth * 20),
                opacity: isActive ? 1 : activeId === null ? 0.55 + depth * 0.45 : isRelated ? 0.95 : 0.4,
                transition: rotating ? "opacity 300ms" : "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 300ms",
              }}
            >
              <span className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "relative grid h-11 w-11 place-items-center rounded-full border-2 bg-bg transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-teal",
                    isActive ? "scale-125" : "group-hover:scale-110",
                    isRelated && "animate-pulse",
                  )}
                  style={{
                    borderColor: isActive || isRelated ? item.tone : `${item.tone}66`,
                    color: item.tone,
                    boxShadow: isActive ? `0 0 28px ${item.tone}88` : undefined,
                  }}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span
                  className={cn(
                    "hidden max-w-[120px] text-center text-[11px] font-medium leading-tight transition-colors sm:block",
                    isActive ? "text-fg" : "text-fg-muted group-hover:text-fg",
                  )}
                >
                  {item.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[260px]" aria-live="polite">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.35 }}
              className="panel p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: active.tone }}>
                {active.kicker}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">{active.title}</p>
              <p className="mt-2 leading-relaxed text-fg-muted">{active.content}</p>
              {active.href ? (
                <a
                  href={active.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] text-teal hover:underline"
                >
                  {active.hrefLabel ?? "Open"} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {active.relatedIds.length ? (
                <div className="mt-6 border-t border-line pt-4">
                  <p className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-widest text-fg-muted">
                    <Link2 className="h-3 w-3" /> connected nodes
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {active.relatedIds.map((rid) => {
                      const r = items.find((i) => i.id === rid);
                      if (!r) return null;
                      return (
                        <button
                          key={rid}
                          type="button"
                          onClick={() => select(rid)}
                          className="chip transition hover:border-line-strong hover:text-fg"
                        >
                          {r.title} →
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <button type="button" onClick={() => select(null)} className="mt-6 font-mono text-[11px] text-fg-muted hover:text-fg">
                ← back to orbit
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-line-strong bg-bg/85 p-6 backdrop-blur-md"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">{items.length} nodes in orbit</p>
              <p className="mt-3 text-xl font-semibold tracking-tight">Pick a node to inspect it.</p>
              <ul className="mt-4 space-y-1.5">
                {items.map((i) => (
                  <li key={i.id}>
                    <button
                      type="button"
                      onClick={() => select(i.id)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[14px] text-fg-muted transition hover:bg-surface-hover hover:text-fg"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: i.tone }} />
                      <span className="flex-1">{i.title}</span>
                      <span className="font-mono text-[10.5px] text-fg-dim">{i.kicker}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
