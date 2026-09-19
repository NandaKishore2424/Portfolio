"use client";

import { motion } from "motion/react";
import { Award, BookOpen, Cloud, Code2, GraduationCap, Megaphone, Sparkles, Trophy, Users } from "lucide-react";
import { achievements, certifications, education } from "@/content/education";
import { SectionHeading } from "@/components/section-heading";
import { RadialOrbitalTimeline, type OrbitItem } from "@/components/ui/radial-orbital-timeline";

const achievementIcons = [BookOpen, Trophy, Award, Megaphone, Users];
const certIcons = [Code2, Cloud, Sparkles];
const tone = { publication: "#a78bfa", award: "#fbbf24", leadership: "#5eead4", certification: "#4ade80" } as const;
const kindLabel = { publication: "publication", award: "award", leadership: "community" } as const;

// Nodes are "connected" only when they share a category; no invented links.
const orbitItems: OrbitItem[] = (() => {
  const items: (OrbitItem & { group: string })[] = [
    ...achievements.map((a, i) => ({
      id: i + 1,
      title: a.title,
      kicker: kindLabel[a.kind],
      content: a.detail,
      icon: achievementIcons[i] ?? Award,
      tone: tone[a.kind],
      relatedIds: [] as number[],
      href: a.href,
      hrefLabel: a.href ? "Read on IEEE Xplore" : undefined,
      group: a.kind as string,
    })),
    ...certifications.map((c, i) => ({
      id: achievements.length + i + 1,
      title: c.name,
      kicker: "certification",
      content: `Certification from ${c.issuer}.`,
      icon: certIcons[i] ?? Award,
      tone: tone.certification,
      relatedIds: [] as number[],
      group: "certification",
    })),
  ];
  return items.map(({ group, ...item }) => ({
    ...item,
    relatedIds: items.filter((o) => o.group === group && o.id !== item.id).map((o) => o.id),
  }));
})();

export function Education() {
  return (
    <section id="education" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          method="GET"
          path="/education"
          index="06 / 07"
          title="Before the job:"
          accent="engineering, research, community."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="panel relative grid gap-8 overflow-hidden p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue/10 blur-3xl" />
          <div>
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-blue/30 bg-blue/10 text-blue">
                <GraduationCap className="h-6 w-6" />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-tight">{education.school}</p>
                <p className="mt-1 text-fg-muted">{education.degree}</p>
                <p className="mt-2 font-mono text-[12px] text-fg-dim">{education.period}</p>
              </div>
            </div>
            <p className="kicker mt-8">Coursework</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="relative flex flex-col justify-end">
            <div className="flex items-end gap-3">
              <span className="font-mono text-6xl font-semibold tracking-tighter">8.98</span>
              <span className="pb-2 font-mono text-sm text-fg-dim">/ 10 CGPA</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "89.8%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-blue via-teal to-green"
              />
            </div>
          </div>
        </motion.div>

        <div className="mt-16">
          <p className="kicker mb-2">Achievements & certifications</p>
          <p className="mb-6 max-w-xl text-fg-muted">
            Eight nodes in orbit. Select one to inspect it; nodes in the same category light up together.
          </p>
          <div className="overflow-hidden rounded-3xl border border-line bg-bg/75 p-4 backdrop-blur-md md:p-8">
            <RadialOrbitalTimeline items={orbitItems} centerLabel="NK" />
          </div>
        </div>
      </div>
    </section>
  );
}
