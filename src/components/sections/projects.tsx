"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { SectionHeading } from "@/components/section-heading";
import { GithubIcon } from "@/components/icons";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { OutboxSimulator } from "@/components/visuals/outbox-simulator";
import { PipelineVisual } from "@/components/visuals/pipeline-visual";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";

const accent = {
  amber: { text: "text-amber", from: "#fbbf24", to: "#5eead4", glow: "rgba(251,191,36,0.14)" },
  violet: { text: "text-violet", from: "#a78bfa", to: "#60a5fa", glow: "rgba(167,139,250,0.16)" },
} as const;

function ProjectCard({
  project,
  index,
  progress,
  total,
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const a = accent[project.accent];
  const stacked = useMediaQuery("(min-width: 768px)");
  // On wide screens the cards stack: as later cards slide over, earlier ones recede.
  const start = index / total;
  const recede = stacked && index < total - 1;
  const scale = useTransform(progress, [start, 1], [1, recede ? 1 - (total - index - 1) * 0.04 : 1]);
  const dim = useTransform(progress, [Math.min(start + 0.25, 0.98), Math.min(start + 0.6, 1)], [0, recede ? 0.35 : 0]);

  // A card taller than the viewport sticks by its bottom edge, so all of it can be read.
  const cardRef = useRef<HTMLElement>(null);
  const [top, setTop] = useState(96);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const update = () => setTop(Math.min(96, window.innerHeight - el.offsetHeight - 24));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="md:sticky" style={{ zIndex: index + 1, top }}>
      <motion.article
        ref={cardRef}
        style={{ scale }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8 origin-top overflow-hidden rounded-3xl border border-line-strong bg-[linear-gradient(160deg,rgba(16,22,34,0.98),rgba(7,10,16,0.98))] shadow-[0_-20px_80px_-40px_rgba(0,0,0,0.9)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: a.glow }}
        />
        <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-3 font-mono text-[11px] text-fg-dim">
              <span className={a.text}>{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-line-strong" />
              <span>{project.tagline}</span>
            </div>
            <h3 className="mt-4 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">{project.name}</h3>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-muted text-pretty">{project.summary}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {project.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-bg/50 px-3 py-2.5">
                  <dd className="font-mono text-2xl font-semibold tracking-tight">
                    <NumberTicker value={s.value} className="tracking-tight text-fg" />
                  </dd>
                  <dt className="mt-0.5 text-[11.5px] leading-tight text-fg-dim">{s.label}</dt>
                </div>
              ))}
            </dl>

            <ul className="mt-6 space-y-2.5">
              {project.bullets.map((b) => (
                <li key={b} className="flex gap-2.5 text-[14px] leading-relaxed text-fg-muted">
                  <Check className={cn("mt-1 h-3.5 w-3.5 shrink-0", a.text)} />
                  <span className="text-pretty">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-8">
              <Link
                href={`/projects/${project.slug}`}
                className="group inline-flex items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-white"
              >
                Read the case study
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-medium transition hover:border-fg-dim"
              >
                <GithubIcon className="h-4 w-4" />
                Source
                <ArrowUpRight className="h-3.5 w-3.5 text-fg-dim" />
              </a>
            </div>
          </div>

          <div className="relative flex min-w-0 items-center">
            <div className="w-full min-w-0">
              {project.slug === "skillbridge" ? <OutboxSimulator /> : <PipelineVisual />}
            </div>
          </div>
        </div>
        <BorderBeam size={220} duration={12} colorFrom={a.from} colorTo={a.to} borderWidth={1.5} />
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-bg" />
      </motion.article>
    </div>
  );
}

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="projects" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          method="GET"
          path="/projects"
          index="04 / 07"
          title="Two systems,"
          accent="built to be questioned."
          lede="A Spring Boot platform with a messaging pipeline that survives a broker outage, and a FastAPI pipeline that keeps the LLM away from billing decisions. Each has a case study covering the architecture and the reasoning behind it."
        />
        <div ref={ref} className="relative">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} progress={scrollYProgress} total={projects.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
