"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/section-heading";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ScrollWords } from "@/components/ui/scroll-words";
import { BorderBeam } from "@/components/ui/border-beam";

const facts = [
  { k: "service", v: "nanda-kishore" },
  { k: "role", v: "backend engineer" },
  { k: "region", v: "chennai, in" },
  { k: "runtime", v: "java 17 · python" },
  { k: "education", v: "BE ECE · 2026" },
];

function ServiceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="panel relative overflow-hidden p-3"
    >
      <div className="group relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={profile.photo}
          alt={`Portrait of ${profile.name}`}
          fill
          sizes="(min-width: 1024px) 380px, 90vw"
          className="object-cover grayscale-[65%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(5,7,11,0.18)_50%)] bg-[length:100%_4px] mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/85 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-line-strong bg-bg/70 px-2.5 py-1 font-mono text-[11px] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-green/70" />
            <span className="relative h-2 w-2 rounded-full bg-green" />
          </span>
          status: healthy
        </div>
      </div>
      <dl className="mt-3 grid gap-1.5 px-1.5 pb-1.5 font-mono text-[12px]">
        {facts.map((f) => (
          <div key={f.k} className="flex items-baseline justify-between gap-4 border-b border-dashed border-line pb-1.5 last:border-0">
            <dt className="text-fg-dim">{f.k}</dt>
            <dd className="text-right text-fg">{f.v}</dd>
          </div>
        ))}
      </dl>
      <BorderBeam size={120} duration={9} colorFrom="#5eead4" colorTo="#a78bfa" />
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          method="GET"
          path="/about"
          index="02 / 07"
          title="I build the layer"
          accent="that has to be right."
        />

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div>
            <ScrollWords
              text={profile.summary}
              highlights={["PostgreSQL", "concurrency", "row-level", "transactional", "Java", "Spring", "Python", "FastAPI."]}
              className="text-2xl font-medium leading-[1.35] tracking-tight md:text-[2.1rem]"
            />

            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
              {profile.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.08 * i, duration: 0.6 }}
                  className="bg-bg/85 p-5 backdrop-blur-md md:p-6"
                >
                  <p className="font-mono text-3xl font-semibold tracking-tight md:text-4xl">
                    {"prefix" in s ? <span className="text-fg-dim">{s.prefix}</span> : null}
                    <NumberTicker value={s.value} className="tracking-tight text-fg" />
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-fg-muted">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] text-fg-dim">
              Counts are from my 12 months at Botcode (HealthPilot.ai).
            </p>

          </div>

          <ServiceCard />
        </div>
      </div>
    </section>
  );
}
