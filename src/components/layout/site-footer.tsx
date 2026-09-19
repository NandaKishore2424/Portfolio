import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-line-strong bg-surface-solid font-mono text-[13px] font-semibold">
              {profile.initials}
            </span>
            <div className="leading-tight">
              <p className="font-medium">{profile.name}</p>
              <p className="font-mono text-xs text-fg-dim">{profile.role}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">
            Backend engineer in Chennai. Java, Spring Boot, PostgreSQL, and the parts of a system that
            have to stay correct under load.
          </p>
          <p className="mt-6 font-mono text-[11px] text-fg-dim">
            <span className="text-green">HTTP/1.1 200 OK</span> · connection: keep-alive
          </p>
        </div>

        <div>
          <p className="kicker mb-4">Work</p>
          <ul className="space-y-2.5 text-sm">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="text-fg-muted transition hover:text-fg">
                  {p.name} <span className="text-fg-dim">· case study</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#experience" className="text-fg-muted transition hover:text-fg">
                Botcode · HealthPilot.ai
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="kicker mb-4">Elsewhere</p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-fg-muted transition hover:text-fg">
                <GithubIcon className="h-3.5 w-3.5" /> GitHub <ArrowUpRight className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-fg-muted transition hover:text-fg">
                <LinkedinIcon className="h-3.5 w-3.5" /> LinkedIn <ArrowUpRight className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="text-fg-muted transition hover:text-fg">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.resume} download className="text-fg-muted transition hover:text-fg">
                Resume (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 font-mono text-[11px] text-fg-dim sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>© {year} {profile.name}</p>
          <p>Built with Next.js, React Three Fiber, GSAP and Motion</p>
        </div>
      </div>
    </footer>
  );
}
