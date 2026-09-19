import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CornerDownRight } from "lucide-react";
import { caseStudies, getProject, projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GithubIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ArchitectureDiagram } from "@/components/case-study/architecture-diagram";
import { ContainerScroll } from "@/components/ui/container-scroll";
import { CaseToc } from "@/components/case-study/case-toc";
import { Figure } from "@/components/case-study/figures";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const cs = caseStudies[project.slug];
  return {
    title: `${project.name}: case study`,
    description: cs.headline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} · ${profile.name}`,
      description: cs.headline,
      url: `${profile.siteUrl}/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} · ${profile.name}`,
      description: cs.headline,
    },
  };
}

const accentText = { amber: "text-amber", violet: "text-violet" } as const;
const accentGlow = { amber: "bg-amber/10", violet: "bg-violet/12" } as const;

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = caseStudies[project.slug];
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <SiteHeader variant="page" />
      <main id="main" className="relative overflow-x-clip">
        <div
          aria-hidden
          className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[760px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div aria-hidden className={`pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full blur-3xl ${accentGlow[project.accent]}`} />

        {/* Hero */}
        <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 md:px-8 md:pt-36">
          <Reveal>
            <Link href="/#projects" className="inline-flex items-center gap-2 font-mono text-[12px] text-fg-muted transition hover:text-fg">
              <ArrowLeft className="h-3.5 w-3.5" /> cd ../projects
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-10 flex items-center gap-3 font-mono text-[12px] text-fg-muted">
              <span className={accentText[project.accent]}>case study · {String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-10 bg-line-strong" />
              <span>{project.tagline}</span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 text-[clamp(3.2rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.05em]">{project.name}</h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 max-w-3xl font-serif text-2xl italic leading-snug text-fg-muted text-balance md:text-4xl">{cs.headline}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-white"
              >
                <GithubIcon className="h-4 w-4" /> View source <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-medium transition hover:border-fg-dim"
              >
                Resume (PDF)
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
              {cs.facts.map((f) => (
                <div key={f.label} className="bg-bg/90 p-4 md:p-5">
                  <dt className="kicker">{f.label}</dt>
                  <dd className="mt-1.5 text-[14px] text-fg">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.36}>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {project.stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-line bg-bg/60 px-4 py-3">
                  <p className="font-mono text-2xl font-semibold tracking-tight">{s.value.toLocaleString("en-US")}</p>
                  <p className="text-[12px] text-fg-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Architecture */}
        <section className="relative mx-auto max-w-7xl px-5 pb-20 md:px-8">
          <p className="kicker mb-4">Architecture</p>
          <div className="hidden md:block">
            <ContainerScroll>
              <ArchitectureDiagram bare nodes={cs.architecture.nodes} edges={cs.architecture.edges} caption={cs.architecture.caption} />
            </ContainerScroll>
          </div>
          <div className="md:hidden">
            <ArchitectureDiagram nodes={cs.architecture.nodes} edges={cs.architecture.edges} caption={cs.architecture.caption} />
          </div>
        </section>

        {/* Context */}
        <section className="relative mx-auto max-w-7xl px-5 pb-12 md:px-8">
          <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-[220px_1fr]">
            <p className="kicker">The problem</p>
            <div className="grid gap-6 md:grid-cols-2">
              {cs.intro.map((para, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="text-[17px] leading-relaxed text-fg-muted text-pretty">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Deep dives */}
        <section className="relative mx-auto max-w-7xl px-5 pb-24 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <CaseToc items={cs.sections.map((s) => ({ id: s.id, title: s.title, kicker: s.kicker }))} />
            </aside>
            <div className="min-w-0 space-y-20 md:space-y-28">
              {cs.sections.map((s) => (
                <article key={s.id} id={s.id} className="scroll-mt-28">
                  <Reveal>
                    <p className={`font-mono text-[12px] ${accentText[project.accent]}`}>{s.kicker}</p>
                    <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl">{s.title}</h2>
                  </Reveal>
                  <div className="mt-6 max-w-3xl space-y-4">
                    {s.body.map((para, i) => (
                      <Reveal key={i} delay={0.05 * i}>
                        <p className="text-[16px] leading-relaxed text-fg-muted text-pretty">{para}</p>
                      </Reveal>
                    ))}
                  </div>
                  {s.points?.length ? (
                    <Reveal delay={0.1}>
                      <ul className="mt-6 max-w-3xl space-y-2.5">
                        {s.points.map((pt) => (
                          <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-fg">
                            <CornerDownRight className={`mt-1 h-4 w-4 shrink-0 ${accentText[project.accent]}`} />
                            <span className="text-pretty">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  ) : null}
                  {s.figure ? (
                    <Reveal delay={0.15} className="mt-8">
                      <Figure id={s.figure} />
                    </Reveal>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Next */}
        <section className="relative mx-auto max-w-7xl px-5 pb-24 md:px-8">
          <Link
            href={`/projects/${next.slug}`}
            className="group relative block overflow-hidden rounded-3xl border border-line-strong bg-surface-solid p-8 transition hover:border-fg-dim md:p-12"
          >
            <p className="kicker">Next case study</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-5xl font-semibold tracking-[-0.04em] md:text-7xl">{next.name}</p>
                <p className="mt-2 text-fg-muted">{next.tagline}</p>
              </div>
              <span className="grid h-14 w-14 place-items-center rounded-full border border-line-strong transition group-hover:translate-x-1 group-hover:border-teal group-hover:text-teal">
                <ArrowRight className="h-6 w-6" />
              </span>
            </div>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
