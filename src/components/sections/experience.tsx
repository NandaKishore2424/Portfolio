"use client";

import { motion } from "motion/react";
import { Building2, CalendarRange, MapPin } from "lucide-react";
import { experience, type Highlight } from "@/content/experience";
import { SectionHeading } from "@/components/section-heading";
import { Timeline } from "@/components/ui/timeline";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { TenantsVisual } from "@/components/visuals/tenants-visual";
import { RaceVisual } from "@/components/visuals/race-visual";
import { ChecksVisual } from "@/components/visuals/checks-visual";
import { DiffVisual } from "@/components/visuals/diff-visual";

function Visual({ h }: { h: Highlight }) {
  switch (h.visual) {
    case "tenants":
      return <TenantsVisual />;
    case "race":
      return <RaceVisual />;
    case "checks":
      return <ChecksVisual checks={h.checks ?? []} tests={Number(h.metric?.value ?? 0)} />;
    case "diff":
      return <DiffVisual diff={h.diff ?? []} />;
  }
}

function HighlightCard({ h }: { h: Highlight }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-line p-1.5"
    >
      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div className="relative rounded-xl bg-[linear-gradient(180deg,rgba(15,21,32,0.96),rgba(8,11,17,0.96))] p-5 md:p-7">
        <h3 className="text-xl font-semibold tracking-tight text-balance md:text-2xl">{h.title}</h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg-muted text-pretty">{h.body}</p>
        <div className="mt-6">
          <Visual h={h} />
        </div>
        {h.metric && h.visual !== "checks" ? (
          <div className="mt-5 flex items-baseline gap-3 border-t border-line pt-4">
            <span className="font-mono text-3xl font-semibold text-teal">{h.metric.value}</span>
            <span className="text-sm text-fg-muted">{h.metric.label}</span>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export function Experience() {
  const e = experience;
  return (
    <section id="experience" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          method="GET"
          path="/experience"
          index="03 / 07"
          title="Twelve months on a"
          accent="multi-tenant healthcare platform."
          lede={`${e.context} I worked on its REST APIs and PostgreSQL data layer, onsite, full-time.`}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="panel grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-teal/30 bg-teal/10 text-teal">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {e.company} <span className="font-normal text-fg-dim">·</span>{" "}
                <span className="font-serif font-normal italic text-fg-muted">{e.product}</span>
              </p>
              <p className="mt-1 text-fg-muted">{e.role}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12px] text-fg-dim">
                <span className="flex items-center gap-1.5">
                  <CalendarRange className="h-3.5 w-3.5" /> {e.period}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {e.location}
                </span>
                <span>{e.employment}</span>
              </div>
            </div>
          </div>
          <div className="flex max-w-md flex-wrap gap-2 md:justify-end">
            {e.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        <Timeline
          className="mt-4"
          data={e.highlights.map((h, i) => ({
            id: h.id,
            title: (
              <div className="md:w-56">
                <p className="font-mono text-[11px] text-fg-dim">commit {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-fg md:text-2xl">{h.kicker}</p>
              </div>
            ),
            content: <HighlightCard h={h} />,
          }))}
        />
      </div>
    </section>
  );
}
