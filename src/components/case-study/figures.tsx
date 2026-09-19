"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowDown, Check, CircleSlash, KeyRound, Lock, ShieldCheck, X } from "lucide-react";
import { OutboxSimulator } from "@/components/visuals/outbox-simulator";
import { PipelineVisual, pipelineNodes } from "@/components/visuals/pipeline-visual";
import { RaceVisual, claimCopy } from "@/components/visuals/race-visual";
import { QueryBudgetChart } from "./query-budget-chart";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("min-w-0 rounded-2xl border border-line bg-[#0b1019] p-4 md:p-5", className)}>{children}</div>;
}

function useOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return [ref, inView] as const;
}

/* ------------------------------ SkillBridge ------------------------------ */

const requestSteps = [
  { k: "CorrelationIdFilter", v: "assigns the trace id", tone: "text-fg-muted" },
  { k: "JWT authentication", v: "principal built from signed token claims, tenant included", tone: "text-green" },
  { k: "@PreAuthorize(\"hasRole('STUDENT')\")", v: "method-level authorization", tone: "text-green" },
  { k: "@Transactional(readOnly = true)", v: "tenant filter enabled on this transaction's session", tone: "text-teal" },
  { k: "Repositories", v: "fetch join + page-level bulk loads", tone: "text-blue" },
  { k: "DTOs → PagedResponse", v: "5 statements, whatever the tenant size", tone: "text-amber" },
];

function RequestFlow() {
  const [ref, inView] = useOnce<HTMLOListElement>();
  return (
    <Frame>
      <p className="mb-3 font-mono text-[12px]">
        <span className="text-teal">GET</span> <span className="text-fg">/api/v1/student/batches</span>
      </p>
      <ol ref={ref} className="relative space-y-2 border-l border-line pl-5">
        {requestSteps.map((s, i) => (
          <motion.li
            key={s.k}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.18, duration: 0.45, ease }}
            className="relative"
          >
            <span className="absolute -left-[25px] top-2 h-2 w-2 rounded-full border border-bg bg-teal" />
            <p className={cn("font-mono text-[12px]", s.tone)}>{s.k}</p>
            <p className="text-[12.5px] text-fg-muted">{s.v}</p>
          </motion.li>
        ))}
      </ol>
    </Frame>
  );
}

const tenantLayers = [
  { name: "Signed JWT claim", note: "The college comes from the token, never from the request.", icon: KeyRound, tone: "#4ade80" },
  { name: "Explicit college predicate", note: "List endpoints name their college in the query.", icon: Check, tone: "#60a5fa" },
  { name: "Hibernate collegeFilter", note: "Safety net for JPQL and Criteria queries, enabled per transaction.", icon: ShieldCheck, tone: "#5eead4" },
  { name: "Ownership guard", note: "Loads by id answer 404, not 403, for another college's rows.", icon: Lock, tone: "#fbbf24" },
];

function TenantLayers() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  return (
    <Frame>
      <div ref={ref} className="grid gap-4 md:grid-cols-[1fr_220px]">
        <ol className="space-y-2">
          {tenantLayers.map((l, i) => {
            const Icon = l.icon;
            return (
              <motion.li
                key={l.name}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5, ease }}
                className="flex items-start gap-3 rounded-xl border border-line bg-bg/60 p-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border" style={{ color: l.tone, borderColor: `${l.tone}44`, background: `${l.tone}12` }}>
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[14px] font-medium">{l.name}</span>
                  <span className="block text-[12.5px] text-fg-muted">{l.note}</span>
                </span>
              </motion.li>
            );
          })}
        </ol>
        <div className="flex flex-col justify-center gap-2 rounded-xl border border-dashed border-line-strong p-3 font-mono text-[11.5px]">
          <p className="text-fg-muted">probe from college A</p>
          <p>
            <span className="text-teal">GET</span> /batches/<span className="text-amber">42</span>
          </p>
          <p className="text-fg-muted">batch 42 belongs to college B</p>
          <ArrowDown className="h-4 w-4 text-fg-dim" />
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="rounded-md border border-rose/30 bg-rose/10 px-2 py-1 text-rose"
          >
            404 Not Found
          </motion.p>
          <p className="text-[11px] leading-snug text-fg-muted">Indistinguishable from an id that doesn&apos;t exist.</p>
        </div>
      </div>
    </Frame>
  );
}

const roles = [
  { name: "SYSTEM_ADMIN", scope: "all colleges", does: "Manages colleges and replays dead letters", tone: "#fb7185" },
  { name: "COLLEGE_ADMIN", scope: "own college", does: "Batches, trainers, students, enrollments", tone: "#fbbf24" },
  { name: "TRAINER", scope: "own college", does: "Syllabus editing and topic grading", tone: "#5eead4" },
  { name: "STUDENT", scope: "self", does: "Profile, skills, applications, progress", tone: "#a78bfa" },
];

function Roles() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  return (
    <Frame>
      <div ref={ref} className="grid gap-2 sm:grid-cols-2">
        {roles.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5, ease }}
            className="rounded-xl border border-line bg-bg/60 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[12px]" style={{ color: r.tone }}>
                {r.name}
              </span>
              <span className="chip">{r.scope}</span>
            </div>
            <p className="mt-2 text-[13px] text-fg-muted">{r.does}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-3 font-mono text-[12px] text-fg-muted">
        <span>
          <span className="text-lg font-semibold text-fg">113</span> @PreAuthorize rules
        </span>
        <span>
          <span className="text-lg font-semibold text-fg">122</span> endpoints
        </span>
        <span>
          <span className="text-lg font-semibold text-fg">20</span> controllers
        </span>
      </div>
    </Frame>
  );
}

function Dedup() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  return (
    <div ref={ref} className="grid gap-3 md:grid-cols-2">
      <Frame>
        <p className="font-mono text-[11px] text-fg-muted">broker killed for 60 s · redelivery</p>
        <div className="mt-3 space-y-2 font-mono text-[12px]">
          {[
            { t: "deliver event 7f3a", r: "claim acquired → processed → ack", ok: true },
            { t: "broker restarts", r: "unacked delivery requeued", ok: null },
            { t: "deliver event 7f3a (again)", r: "claim exists → skip → ack", ok: false },
          ].map((row, i) => (
            <motion.div
              key={row.t}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.35 }}
              className="rounded-lg border border-line bg-bg/60 px-3 py-2"
            >
              <p className="text-fg">{row.t}</p>
              <p className={cn("mt-0.5 flex items-center gap-1.5 text-[11.5px]", row.ok === true ? "text-green" : row.ok === false ? "text-amber" : "text-fg-muted")}>
                {row.ok === true ? <Check className="h-3 w-3" /> : row.ok === false ? <CircleSlash className="h-3 w-3" /> : null}
                {row.r}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-fg-muted">
          Claim table: <span className="font-mono text-fg">event_id</span> + lease + fencing token, so a stale worker can&apos;t finish someone
          else&apos;s claim.
        </p>
      </Frame>
      <Frame>
        <p className="font-mono text-[11px] text-fg-muted">SIGTERM during a delivery</p>
        <ol className="mt-3 space-y-2 font-mono text-[12px]">
          {["delivery in flight", "SIGTERM received → stop consuming", "in-flight work finishes", "ack sent → process exits"].map((s, i) => (
            <motion.li
              key={s}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.35 }}
              className="flex items-center gap-2"
            >
              <span className={cn("grid h-5 w-5 place-items-center rounded-md text-[10px]", i === 3 ? "bg-green/15 text-green" : "bg-surface-hover text-fg-muted")}>
                {i + 1}
              </span>
              <span className={i === 1 ? "text-amber" : "text-fg"}>{s}</span>
            </motion.li>
          ))}
        </ol>
        <p className="mt-4 text-[12px] text-fg-muted">Both behaviours were checked against a real broker, not a mock.</p>
      </Frame>
    </div>
  );
}

function Schema() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const stats = [
    { v: 33, l: "tables" },
    { v: 129, l: "indexes" },
    { v: 128, l: "constraints" },
  ];
  const flow = ["pg_catalog (production)", "baseline.sql, version-controlled", "fingerprint check", "disposable Testcontainers", "integration tier"];
  return (
    <Frame>
      <div ref={ref} className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="rounded-xl border border-line bg-bg/60 px-4 py-3 text-center"
            >
              <p className="font-mono text-2xl font-semibold">{s.v}</p>
              <p className="text-[11.5px] text-fg-muted">{s.l}</p>
            </motion.div>
          ))}
        </div>
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11.5px]">
          {flow.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="flex items-center gap-1.5"
            >
              <span className={cn("rounded-md border px-2 py-1", i === 2 ? "border-green/30 bg-green/10 text-green" : "border-line bg-bg/60 text-fg")}>{f}</span>
              {i < flow.length - 1 ? <span className="text-fg-dim">→</span> : null}
            </motion.li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

/* ------------------------------ Integronix ------------------------------- */

const weights = [
  { k: "confidence", w: 40, tone: "#60a5fa" },
  { k: "specificity", w: 30, tone: "#5eead4" },
  { k: "consistency", w: 20, tone: "#a78bfa" },
  { k: "combination", w: 10, tone: "#fbbf24" },
];

function Scoring() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const [fixed, setFixed] = useState(true);
  return (
    <div ref={ref} className="grid gap-3 md:grid-cols-2">
      <Frame>
        <p className="font-mono text-[11px] text-fg-muted">composite score per candidate code</p>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          {weights.map((w, i) => (
            <motion.span
              key={w.k}
              initial={{ width: 0 }}
              animate={inView ? { width: `${w.w}%` } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.8, ease }}
              className="h-full border-r-2 border-[#0b1019] last:border-r-0"
              style={{ background: w.tone }}
            />
          ))}
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px]">
          {weights.map((w) => (
            <li key={w.k} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-fg-muted">
                <span className="h-2 w-2 rounded-sm" style={{ background: w.tone }} />
                {w.k}
              </span>
              <span className="font-mono text-fg">{w.w}%</span>
            </li>
          ))}
          <li className="col-span-2 flex items-center justify-between gap-2 border-t border-line pt-1.5">
            <span className="flex items-center gap-1.5 text-fg-muted">
              <span className="h-2 w-2 rounded-sm bg-rose" />
              negation penalty
            </span>
            <span className="font-mono text-rose">subtracted</span>
          </li>
        </ul>
      </Frame>
      <Frame>
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-fg-muted">specificity: the upcoding fix</p>
          <div className="inline-flex rounded-lg border border-line p-0.5 font-mono text-[11px]">
            {[false, true].map((f) => (
              <button
                key={String(f)}
                type="button"
                onClick={() => setFixed(f)}
                aria-pressed={fixed === f}
                className={cn("rounded-md px-2 py-0.5", fixed === f ? (f ? "bg-green/15 text-green" : "bg-rose/15 text-rose") : "text-fg-muted")}
              >
                {f ? "after" : "before"}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.pre
            key={String(fixed)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 overflow-x-auto rounded-lg border border-line bg-bg/70 p-3 font-mono text-[11.5px] leading-relaxed"
            data-lenis-prevent
          >
            {fixed ? (
              <>
                <span className="text-fg-muted"># scales with documented support</span>
                {"\n"}base = <span className="text-violet">min</span>(len(code) * <span className="text-amber">0.15</span>, <span className="text-amber">1.0</span>)
                {"\n"}support = <span className="text-teal">distinguishing_support</span>(code, chart)
                {"\n"}score = base * (<span className="text-amber">0.35</span> + <span className="text-amber">0.65</span> * support)
              </>
            ) : (
              <>
                <span className="text-fg-muted"># scales with code length alone</span>
                {"\n"}score = <span className="text-violet">min</span>(len(code) * <span className="text-amber">0.15</span>, <span className="text-amber">1.0</span>)
                {"\n"}
                {"\n"}<span className="text-rose"># longer, rarer code wins regardless of the chart</span>
              </>
            )}
          </motion.pre>
        </AnimatePresence>
        <p className="mt-3 text-[12px] text-fg-muted">
          {fixed
            ? "Regression tests cover both directions: a well-supported short code wins, and a rare variant still wins when the chart documents it."
            : "A longer code looked more specific even when the note never documented what made it specific."}
        </p>
      </Frame>
    </div>
  );
}

const ladder = [
  { k: "WHO ICD-11 API", v: "authoritative, ranked candidates", tone: "#5eead4" },
  { k: "SNOMED → ICD-10-CM crosswalk", v: "deterministic table lookup", tone: "#60a5fa" },
  { k: "pgvector cosine similarity", v: "IVFFlat / HNSW, runs only if both above came back empty", tone: "#a78bfa" },
];

function Fallback() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  return (
    <div ref={ref} className="grid gap-3 md:grid-cols-[1fr_1fr]">
      <Frame>
        <ol className="space-y-2">
          {ladder.map((l, i) => (
            <motion.li
              key={l.k}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.2 }}
              className="flex items-start gap-3 rounded-xl border border-line bg-bg/60 p-3"
              style={{ marginLeft: i * 14 }}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px]" style={{ color: l.tone, background: `${l.tone}18` }}>
                {i + 1}
              </span>
              <span>
                <span className="block text-[13.5px] font-medium">{l.k}</span>
                <span className="block text-[12px] text-fg-muted">{l.v}</span>
              </span>
            </motion.li>
          ))}
        </ol>
      </Frame>
      <Frame>
        <p className="font-mono text-[11px] text-fg-muted">the order lives in the graph, not the docs</p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-bg/70 p-3 font-mono text-[11.5px] leading-relaxed" data-lenis-prevent>
          <span className="text-violet">def</span> <span className="text-teal">route_after_mapping</span>(state):
          {"\n"}    <span className="text-violet">if</span> state.get(<span className="text-amber">&quot;candidate_icd_codes&quot;</span>):
          {"\n"}        <span className="text-violet">return</span> <span className="text-amber">&quot;icd_decision&quot;</span>   <span className="text-fg-muted"># skip vector search</span>
          {"\n"}    <span className="text-violet">return</span> <span className="text-amber">&quot;icd_embedding&quot;</span>    <span className="text-fg-muted"># fallback</span>
        </pre>
        <p className="mt-3 text-[12px] text-fg-muted">
          One conditional edge in the whole graph, expressed as data rather than an if statement buried in a node.
        </p>
      </Frame>
    </div>
  );
}

function Tenancy() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const steps = [
    { k: "Bearer JWT", v: "verified Supabase token" },
    { k: "lookup by subject", v: "caller's own users row" },
    { k: "Principal(org)", v: "organization from the database" },
    { k: "assert_org(requested)", v: "mismatch → 403" },
  ];
  return (
    <Frame>
      <div ref={ref} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <ol className="flex flex-col gap-2 md:flex-row md:items-stretch">
          {steps.map((s, i) => (
            <motion.li
              key={s.k}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.18 }}
              className="flex flex-1 items-center gap-2"
            >
              <div className={cn("flex-1 rounded-xl border p-3", i === 3 ? "border-rose/30 bg-rose/5" : "border-line bg-bg/60")}>
                <p className="font-mono text-[12px] text-fg">{s.k}</p>
                <p className="text-[11.5px] text-fg-muted">{s.v}</p>
              </div>
              {i < steps.length - 1 ? <span className="hidden text-fg-dim md:inline">→</span> : null}
            </motion.li>
          ))}
        </ol>
        <div className="rounded-xl border border-line bg-bg/60 px-4 py-3 text-center">
          <p className="font-mono text-2xl font-semibold">
            27<span className="text-fg-dim">/29</span>
          </p>
          <p className="text-[11.5px] text-fg-muted">
            endpoints authenticated
            <br />
            (2 are health checks)
          </p>
        </div>
      </div>
    </Frame>
  );
}

const coverage = [
  { k: "FHIR R4 Claim builder", v: 96 },
  { k: "X12 837P builder · 005010X222A1", v: 89 },
  { k: "X12 835 builder · 005010X221A1", v: 86 },
];

function Coverage() {
  const [ref, inView] = useOnce<HTMLUListElement>();
  return (
    <Frame>
      <p className="font-mono text-[11px] text-fg-muted">line coverage, from a fresh test run</p>
      <ul ref={ref} className="mt-4 space-y-3">
        {coverage.map((c, i) => (
          <li key={c.k} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
            <span className="text-[13px]">{c.k}</span>
            <span className="font-mono text-[13px] font-semibold">{c.v}%</span>
            <div className="col-span-2 h-2 overflow-hidden rounded-full bg-[rgb(148_163_184/0.12)]">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${c.v}%` } : {}}
                transition={{ delay: 0.15 + i * 0.15, duration: 1, ease }}
                className="h-full rounded-full bg-[#199e70]"
              />
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function ShortCircuit() {
  const [mode, setMode] = useState<"before" | "after">("after");
  const failAt = 3; // snomed_resolve
  return (
    <Frame>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-fg-muted">node 4 raises an exception</p>
        <div className="inline-flex rounded-lg border border-line p-0.5 font-mono text-[11px]">
          {(["before", "after"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn("rounded-md px-2 py-0.5", mode === m ? (m === "after" ? "bg-green/15 text-green" : "bg-rose/15 text-rose") : "text-fg-muted")}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {pipelineNodes.map((n, i) => {
          const failed = i === failAt;
          const after = i > failAt;
          return (
            <motion.div
              key={n.id}
              layout
              title={n.id}
              className={cn(
                "flex h-12 flex-col items-center justify-center rounded-lg border font-mono text-[10px]",
                failed
                  ? "border-rose/50 bg-rose/10 text-rose"
                  : after
                    ? mode === "after"
                      ? "border-dashed border-line text-fg-dim"
                      : "border-amber/40 bg-amber/10 text-amber"
                    : "border-line bg-bg/60 text-fg",
              )}
            >
              <span>{i + 1}</span>
              <span className="text-[8.5px]">{failed ? "raised" : after ? (mode === "after" ? "no-op" : "ran") : "ok"}</span>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            "mt-4 rounded-lg border p-3 font-mono text-[12px]",
            mode === "after" ? "border-green/25 bg-green/5" : "border-rose/25 bg-rose/5",
          )}
        >
          {mode === "after" ? (
            <>
              <p className="flex items-center gap-1.5 text-green">
                <Check className="h-3.5 w-3.5" /> HTTP 502 · failed stage: snomed_resolve · reference id
              </p>
              <p className="mt-1 text-fg-muted">The remaining nodes never execute, and nothing half-built is returned.</p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1.5 text-rose">
                <X className="h-3.5 w-3.5" /> HTTP 200 · confident-looking, meaningless result
              </p>
              <p className="mt-1 text-fg-muted">Each later node failed silently in its own way on half-built state.</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Frame>
  );
}

function Tests() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  return (
    <div ref={ref} className="grid gap-3 md:grid-cols-2">
      <Frame>
        <p className="font-mono text-[11px] text-fg-muted">359 tests</p>
        <div className="mt-4 flex h-8 gap-[2px] overflow-hidden rounded-lg">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${(323 / 359) * 100}%` } : {}}
            transition={{ duration: 1, ease }}
            className="grid h-full place-items-center rounded-l-lg bg-[#199e70] font-mono text-[11px] font-semibold text-white"
          >
            323
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${(36 / 359) * 100}%` } : {}}
            transition={{ delay: 0.4, duration: 0.8, ease }}
            className="grid h-full place-items-center rounded-r-lg bg-[#3987e5] font-mono text-[11px] font-semibold text-white"
          >
            36
          </motion.div>
        </div>
        <ul className="mt-3 space-y-1 text-[12.5px] text-fg-muted">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-[#199e70]" /> hermetic: fake data layer, zero network calls
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-[#3987e5]" /> integration: live database and model provider
          </li>
        </ul>
      </Frame>
      <Frame>
        <p className="font-mono text-[11px] text-fg-muted">the bug that created the schema-contract test</p>
        <div className="mt-3 space-y-2 font-mono text-[12px]">
          <p>
            audit row → <span className="text-amber">public.users</span>
          </p>
          <p>
            foreign key → <span className="text-teal">auth.users</span>
          </p>
          <p className="flex items-center gap-1.5 text-green">
            <Check className="h-3.5 w-3.5" /> every mocked test: passed
          </p>
          <p className="flex items-center gap-1.5 text-rose">
            <X className="h-3.5 w-3.5" /> Postgres: rejected the first real submission
          </p>
        </div>
        <p className="mt-3 text-[12px] text-fg-muted">
          The contract test now checks foreign keys, CHECK constraints, and every table and RPC name against the live schema.
        </p>
      </Frame>
    </div>
  );
}

export const figures: Record<string, () => ReactNode> = {
  "request-flow": () => <RequestFlow />,
  "tenant-layers": () => <TenantLayers />,
  roles: () => <Roles />,
  "outbox-sim": () => <OutboxSimulator />,
  dedup: () => <Dedup />,
  "query-budget": () => <QueryBudgetChart />,
  schema: () => <Schema />,
  pipeline: () => <PipelineVisual />,
  scoring: () => <Scoring />,
  fallback: () => <Fallback />,
  race: () => (
    <Frame>
      <RaceVisual copy={claimCopy} />
    </Frame>
  ),
  tenancy: () => <Tenancy />,
  coverage: () => <Coverage />,
  "short-circuit": () => <ShortCircuit />,
  tests: () => <Tests />,
};

export function Figure({ id }: { id?: string }) {
  if (!id || !figures[id]) return null;
  const Render = figures[id];
  return <Render />;
}
