"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { CheckCircle2, Play, Power, Server, Database, Radio, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * A compressed replay of SkillBridge's broker-outage integration test:
 * events keep being written while RabbitMQ is down; the outbox holds them
 * and the relay drains the backlog when the broker returns.
 * Real run: 601 events written, 601 delivered, 0 dead.
 */

const TOTAL = 601;
const TICK_MS = 100;
const SCRIPT = { writeUntil: 72, downAt: 18, upAt: 50 }; // in ticks

type State = {
  mode: "idle" | "replay" | "settled" | "free";
  t: number;
  written: number;
  pending: number;
  delivered: number;
  brokerUp: boolean;
  backoff: number; // seconds the relay would wait
  sinceBackoff: number;
  done: boolean;
};

type Action = { type: "tick" } | { type: "replay" } | { type: "toggle-broker" };

const initial: State = {
  mode: "idle",
  t: 0,
  written: 0,
  pending: 0,
  delivered: 0,
  brokerUp: true,
  backoff: 0,
  sinceBackoff: 0,
  done: false,
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "replay":
      return { ...initial, mode: "replay" };
    case "toggle-broker":
      return {
        ...s,
        // Interacting during a replay keeps the replay going; otherwise switch to free play.
        mode: s.mode === "replay" ? "replay" : "free",
        done: false,
        brokerUp: !s.brokerUp,
        backoff: s.brokerUp ? 1 : 0,
        sinceBackoff: 0,
      };
    case "tick": {
      if (s.mode === "idle" || s.mode === "settled") return s;
      const t = s.t + 1;
      let { written, pending, delivered, brokerUp, backoff, sinceBackoff } = s;

      if (s.mode === "replay") {
        if (t === SCRIPT.downAt) {
          brokerUp = false;
          backoff = 1;
          sinceBackoff = 0;
        }
        if (t === SCRIPT.upAt) {
          brokerUp = true;
          backoff = 0;
        }
        if (t <= SCRIPT.writeUntil) {
          const target = Math.round((TOTAL * t) / SCRIPT.writeUntil);
          const add = target - written;
          written += add;
          pending += add;
        }
      } else if (s.mode === "free" && t % 3 === 0) {
        written += 1;
        pending += 1;
      }

      if (brokerUp) {
        const batch = Math.min(pending, 24);
        pending -= batch;
        delivered += batch;
      } else {
        sinceBackoff += 1;
        if (sinceBackoff >= 4) {
          backoff = Math.min(30, backoff * 2);
          sinceBackoff = 0;
        }
      }

      const done = s.mode === "replay" && written >= TOTAL && pending === 0 && brokerUp && t > SCRIPT.upAt;
      return { ...s, t, written, pending, delivered, brokerUp, backoff, sinceBackoff, done, mode: done ? "settled" : s.mode };
    }
  }
}

function Stage({
  icon: Icon,
  label,
  sub,
  tone,
  down,
}: {
  icon: typeof Server;
  label: string;
  sub: string;
  tone: string;
  down?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col items-center gap-1.5 rounded-xl border bg-bg/70 px-1 py-3 text-center transition-colors duration-500 sm:px-2",
        down ? "border-rose/50" : "border-line",
      )}
    >
      <span
        className={cn("grid h-8 w-8 place-items-center rounded-lg border transition-colors duration-500")}
        style={{
          color: down ? "var(--rose)" : tone,
          borderColor: down ? "rgb(251 113 133 / 0.4)" : `color-mix(in oklab, ${tone} 35%, transparent)`,
          background: down ? "rgb(251 113 133 / 0.1)" : `color-mix(in oklab, ${tone} 10%, transparent)`,
        }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="w-full truncate font-mono text-[10px] text-fg sm:text-[11px]">{label}</span>
      <span className="hidden w-full truncate font-mono text-[9.5px] text-fg-dim sm:block">{sub}</span>
      {down ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-1.5 -top-1.5 rounded-full border border-rose/50 bg-bg px-1.5 font-mono text-[9px] text-rose"
        >
          down
        </motion.span>
      ) : null}
    </div>
  );
}

function Wire({ active, broken, tone }: { active: boolean; broken?: boolean; tone: string }) {
  return (
    <div className="relative mx-0.5 h-px self-center overflow-visible">
      <div
        className={cn("absolute inset-0 h-px", broken ? "bg-[repeating-linear-gradient(90deg,var(--rose)_0_4px,transparent_4px_8px)]" : "bg-line-strong")}
      />
      {active && !broken ? (
        <>
          {[0, 0.33, 0.66].map((d) => (
            <motion.span
              key={d}
              className="absolute -top-[3px] h-[7px] w-[7px] rounded-full"
              style={{ background: tone, boxShadow: `0 0 10px ${tone}` }}
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.9, ease: "linear" }}
            />
          ))}
        </>
      ) : null}
      {broken ? (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-rose">✕</span>
      ) : null}
    </div>
  );
}

export function OutboxSimulator() {
  const [s, dispatch] = useReducer(reducer, initial);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const started = useRef(false);

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      dispatch({ type: "replay" });
    }
  }, [inView]);

  useEffect(() => {
    if (!inView || s.mode === "idle" || s.mode === "settled") return;
    const id = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => clearInterval(id);
  }, [inView, s.mode]);

  const replay = useCallback(() => dispatch({ type: "replay" }), []);
  const toggle = useCallback(() => dispatch({ type: "toggle-broker" }), []);

  const writing = s.mode === "replay" ? s.t <= SCRIPT.writeUntil : s.mode === "free";
  const relaying = s.brokerUp && (s.pending > 0 || writing);
  const bars = Math.min(16, Math.ceil(s.pending / 12));
  const replayDone = s.done;

  const status = !s.brokerUp
    ? `relay: broker unavailable · outage not charged to events · retry in ${s.backoff}s`
    : s.pending > 40
      ? "relay: broker back · draining backlog with publisher confirms"
      : writing
        ? "relay: FOR UPDATE SKIP LOCKED → publish → confirm"
        : "relay: idle · outbox empty";

  return (
    <div ref={ref} className="rounded-2xl border border-line bg-bg/70 p-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-fg-dim">
          <span className="text-amber">●</span> broker-outage test · replay
          <span className="hidden sm:inline"> (5-minute outage, compressed)</span>
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-fg-muted transition hover:border-line-strong hover:text-fg"
          >
            <Play className="h-3 w-3" /> replay
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={!s.brokerUp}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition",
              s.brokerUp
                ? "border-rose/30 text-rose hover:bg-rose/10"
                : "border-green/30 text-green hover:bg-green/10",
            )}
          >
            <Power className="h-3 w-3" /> {s.brokerUp ? "kill broker" : "restore broker"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_8px_minmax(0,1.15fr)_8px_minmax(0,1fr)_8px_minmax(0,1fr)] items-stretch sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,1.15fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)]">
        <Stage icon={Server} label="API" sub="@Transactional" tone="var(--teal)" />
        <Wire active={writing} tone="var(--teal)" />
        <div className="relative flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-line bg-bg/70 px-2 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-blue/35 bg-blue/10 text-blue">
            <Database className="h-4 w-4" />
          </span>
          <span className="w-full truncate text-center font-mono text-[11px]">outbox</span>
          <div className="flex h-[34px] w-full flex-col-reverse gap-[2px] overflow-hidden px-1">
            <AnimatePresence initial={false}>
              {Array.from({ length: bars }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scaleX: 0.3 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[2px] w-full shrink-0 rounded-full bg-amber/80"
                />
              ))}
            </AnimatePresence>
          </div>
          <span className="font-mono text-[10px] text-amber tabular-nums">
            {s.pending}
            <span className="hidden sm:inline"> pending</span>
          </span>
        </div>
        <Wire active={relaying} broken={!s.brokerUp} tone="var(--amber)" />
        <Stage icon={Radio} label="RabbitMQ" sub="quorum queues" tone="var(--amber)" down={!s.brokerUp} />
        <Wire active={s.brokerUp && s.delivered > 0 && (relaying || s.pending > 0)} tone="var(--violet)" />
        <Stage icon={Cpu} label="consumer" sub="idempotent" tone="var(--violet)" />
      </div>

      <p className={cn("mt-3 truncate font-mono text-[10.5px]", s.brokerUp ? "text-fg-dim" : "text-rose")}>{status}</p>

      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line font-mono sm:grid-cols-4">
        {[
          { k: "written", v: s.written, c: "text-fg" },
          { k: "delivered", v: s.delivered, c: "text-green" },
          { k: "pending", v: s.pending, c: s.pending ? "text-amber" : "text-fg-dim" },
          { k: "dead", v: 0, c: "text-fg-dim" },
        ].map((m) => (
          <div key={m.k} className="bg-bg/90 px-2 py-2">
            <dt className="text-[9.5px] uppercase tracking-wider text-fg-dim">{m.k}</dt>
            <dd className={cn("text-lg font-semibold tabular-nums", m.c)}>{m.v}</dd>
          </div>
        ))}
      </dl>

      <AnimatePresence>
        {replayDone ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-start gap-2 rounded-lg border border-green/25 bg-green/10 px-3 py-2 text-[12px] text-green"
          >
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Same result as the real run against a live broker: 601 written, 601 delivered, 0 dead.
          </motion.p>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-[11.5px] leading-snug text-fg-dim">
            A compressed replay of the integration test. Kill the broker yourself and watch the outbox hold events until it
            comes back.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
