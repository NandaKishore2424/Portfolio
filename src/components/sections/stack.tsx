"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import {
  siDocker,
  siFastapi,
  siFlyway,
  siGit,
  siGithubactions,
  siHibernate,
  siJsonwebtokens,
  siJunit5,
  siLanggraph,
  siLinear,
  siOpenjdk,
  siPostgresql,
  siPytest,
  siPython,
  siRabbitmq,
  siSpringboot,
  siSpringsecurity,
  siTypescript,
} from "simple-icons";
import { skillLayers, type SkillLayer } from "@/content/skills";
import { SectionHeading } from "@/components/section-heading";
import { SimpleIcon } from "@/components/icons";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const layerTone: Record<string, string> = {
  languages: "#60a5fa",
  backend: "#5eead4",
  testing: "#4ade80",
  delivery: "#fbbf24",
  concepts: "#a78bfa",
};

const logos = [
  { name: "OpenJDK", icon: siOpenjdk },
  { name: "Spring Boot", icon: siSpringboot },
  { name: "Spring Security", icon: siSpringsecurity },
  { name: "Hibernate", icon: siHibernate },
  { name: "PostgreSQL", icon: siPostgresql },
  { name: "RabbitMQ", icon: siRabbitmq },
  { name: "Flyway", icon: siFlyway },
  { name: "JWT", icon: siJsonwebtokens },
  { name: "JUnit 5", icon: siJunit5 },
  { name: "Python", icon: siPython },
  { name: "FastAPI", icon: siFastapi },
  { name: "pytest", icon: siPytest },
  { name: "LangGraph", icon: siLanggraph },
  { name: "TypeScript", icon: siTypescript },
  { name: "Docker", icon: siDocker },
  { name: "GitHub Actions", icon: siGithubactions },
  { name: "Git", icon: siGit },
  { name: "Linear", icon: siLinear },
];

function Slab({
  layer,
  index,
  spread,
  focus,
}: {
  layer: SkillLayer;
  index: number;
  spread: MotionValue<number>;
  focus: string | null;
}) {
  const tone = layerTone[layer.id];
  const isFocus = focus === layer.id;
  const lift = useSpring(0, { stiffness: 260, damping: 22 });
  useEffect(() => {
    lift.set(isFocus ? 28 : 0);
  }, [isFocus, lift]);
  const z = useTransform(() => index * spread.get() + lift.get());
  return (
    <motion.div
      style={{ z, x: "-50%", y: "-50%", borderColor: `${tone}${isFocus ? "cc" : "55"}` }}
      animate={{ opacity: focus && !isFocus ? 0.35 : 1 }}
      transition={{ duration: 0.3 }}
      className="absolute left-1/2 top-1/2 h-[210px] w-[210px] rounded-2xl border bg-[rgba(9,13,20,0.82)] p-3 md:h-[270px] md:w-[270px]"
    >
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${tone}${isFocus ? "33" : "14"}, transparent 60%)`,
          boxShadow: isFocus ? `0 0 60px ${tone}55` : "none",
        }}
      />
      <div className="relative flex h-full flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: tone }}>
          L{index + 1} · {layer.name}
        </span>
        <div className="mt-2 flex flex-wrap content-start gap-1">
          {layer.items.map((item) => (
            <span
              key={item}
              className="rounded border px-1 py-0.5 font-mono text-[8.5px] text-fg-muted md:text-[9.5px]"
              style={{ borderColor: `${tone}33` }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Stack() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start 90%", "center 45%"] });
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const spread = useTransform(eased, [0, 1], [6, 58]);
  const rotate = useTransform(eased, [0, 1], [-28, -40]);

  return (
    <section id="stack" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          method="GET"
          path="/stack"
          index="05 / 07"
          title="The stack,"
          accent="layer by layer."
          lede="From the languages at the bottom to the ideas at the top. Scroll to pull the layers apart; hover a row to lift its layer."
        />

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div ref={stageRef} className="relative h-[400px] [perspective:1600px] md:h-[560px]" aria-hidden>
            <motion.div
              style={{ rotateX: 58, rotateZ: rotate, transformStyle: "preserve-3d" }}
              className="absolute left-1/2 top-[58%] h-0 w-0"
            >
              {skillLayers.map((layer, i) => (
                <Slab key={layer.id} layer={layer} index={i} spread={spread} focus={focus} />
              ))}
            </motion.div>
            <div className="pointer-events-none absolute inset-x-10 bottom-4 h-16 rounded-[100%] bg-teal/10 blur-2xl" />
          </div>

          <ol className="relative space-y-2" onMouseLeave={() => setFocus(null)}>
            {[...skillLayers].reverse().map((layer, i) => {
              const tone = layerTone[layer.id];
              const index = skillLayers.length - i;
              return (
                <motion.li
                  key={layer.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setFocus(layer.id)}
                  className={cn(
                    "group rounded-2xl border bg-bg/70 p-4 backdrop-blur-md transition-colors md:p-5",
                    focus === layer.id ? "border-line-strong bg-surface-solid" : "border-line",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px]" style={{ color: tone }}>
                        L{index}
                      </span>
                      <span className="text-lg font-semibold tracking-tight">{layer.name}</span>
                    </p>
                    <span className="font-serif text-sm italic text-fg-dim">{layer.caption}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="chip transition-colors group-hover:text-fg"
                        style={focus === layer.id ? { borderColor: `${tone}55` } : undefined}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <div className="relative mt-20 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Marquee pauseOnHover className="[--duration:48s] [--gap:2.5rem]" repeat={3}>
            {logos.map((l) => (
              <span key={l.name} className="group flex items-center gap-2.5 text-fg-dim transition-colors hover:text-fg">
                <SimpleIcon path={l.icon.path} title={l.name} className="h-5 w-5 transition-colors" />
                <span className="font-mono text-[12px]">{l.name}</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
