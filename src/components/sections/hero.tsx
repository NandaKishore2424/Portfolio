"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowDownToLine, MousePointer2 } from "lucide-react";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { scrollToTarget } from "@/components/providers/smooth-scroll";
import { HyperText } from "@/components/ui/hyper-text";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";

const ease = [0.22, 1, 0.36, 1] as const;

function JsonLine({ k, children, last }: { k: string; children: React.ReactNode; last?: boolean }) {
  return (
    <span className="pl-4">
      <span className="text-teal">&quot;{k}&quot;</span>
      <span className="text-fg-dim">: </span>
      {children}
      {last ? null : <span className="text-fg-dim">,</span>}
    </span>
  );
}

const Str = ({ children }: { children: string }) => <span className="text-amber">&quot;{children}&quot;</span>;

function StrList({ items }: { items: readonly string[] }) {
  return (
    <>
      <span className="text-fg-dim">[</span>
      {items.map((item, i) => (
        <span key={item}>
          <Str>{item}</Str>
          {i < items.length - 1 ? <span className="text-fg-dim">, </span> : null}
        </span>
      ))}
      <span className="text-fg-dim">]</span>
    </>
  );
}

function WhoamiTerminal() {
  const w = profile.whoami;
  return (
    <Terminal
      title="zsh · ~/nanda"
      className="ml-auto max-h-none max-w-[540px] border-line-strong bg-bg/75 [&_code]:text-[13px] shadow-[0_40px_120px_-40px_rgba(94,234,212,0.25)] backdrop-blur-xl [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
    >
      <TypingAnimation duration={28} className="text-fg">
        {"$ curl -s nandakishorer.vercel.app/api/whoami | jq"}
      </TypingAnimation>
      <AnimatedSpan className="text-green">HTTP/1.1 200 OK</AnimatedSpan>
      <AnimatedSpan className="text-fg-dim">{"{"}</AnimatedSpan>
      <AnimatedSpan>
        <JsonLine k="name">
          <Str>{w.name}</Str>
        </JsonLine>
      </AnimatedSpan>
      <AnimatedSpan>
        <JsonLine k="role">
          <Str>{w.role}</Str>
        </JsonLine>
      </AnimatedSpan>
      <AnimatedSpan>
        <JsonLine k="stack">
          <StrList items={w.stack} />
        </JsonLine>
      </AnimatedSpan>
      <AnimatedSpan>
        <JsonLine k="location">
          <Str>{w.location}</Str>
        </JsonLine>
      </AnimatedSpan>
      <AnimatedSpan>
        <JsonLine k="open_to_work" last>
          <span className="text-violet">{String(w.open_to_work)}</span>
        </JsonLine>
      </AnimatedSpan>
      <AnimatedSpan className="text-fg-dim">{"}"}</AnimatedSpan>
      <AnimatedSpan className="text-fg">
        <span>
          $ <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-teal" />
        </span>
      </AnimatedSpan>
    </Terminal>
  );
}

export function Hero() {
  return (
    <section id="top" data-scene-pass className="relative z-10 flex min-h-svh flex-col overflow-hidden">
      {/* readability scrim over the 3D scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_0%_60%,rgba(5,7,11,0.92)_20%,rgba(5,7,11,0.55)_55%,transparent_80%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 pb-24 pt-28 md:px-8 xl:grid-cols-[1.1fr_0.9fr] xl:pt-24">
        <div data-scene-block className="max-w-2xl">
          {profile.whoami.open_to_work ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-bg/60 py-1 pl-2 pr-3.5 font-mono text-[11.5px] text-fg-muted backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-green/70" />
                <span className="relative h-2 w-2 rounded-full bg-green" />
              </span>
              Open to backend engineering roles
            </motion.div>
          ) : null}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-8 font-mono text-sm text-fg-dim"
          >
            <span className="text-teal">GET</span> /whoami <span className="text-fg-dim">→</span>{" "}
            <span className="text-green">200 OK</span>
          </motion.p>

          <h1 className="mt-3 text-[clamp(3rem,7.6vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            <HyperText
              as="span"
              duration={1100}
              delay={250}
              animateOnHover={false}
              characterSet={"abcdefghijklmnopqrstuvwxyz{}<>/=#$%".split("")}
              uppercase={false}
              letterClassName=""
              className="block overflow-visible py-0 text-[length:inherit] font-semibold leading-[inherit]"
            >
              {profile.firstName}
            </HyperText>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.55, duration: 0.9, ease }}
              className="block bg-gradient-to-r from-fg via-fg to-fg-dim bg-clip-text text-transparent"
            >
              R<span className="text-teal">.</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease }}
            className="mt-6 text-2xl font-medium tracking-tight md:text-3xl"
          >
            Software Engineer <span className="text-fg-dim">—</span>{" "}
            <span className="font-serif text-[1.15em] font-normal italic text-teal">Backend</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted text-pretty md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={() => scrollToTarget("#about")}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-fg px-5 py-3 text-sm font-semibold text-bg transition hover:bg-white"
            >
              Follow the request
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </button>
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-bg/50 px-5 py-3 text-sm font-medium backdrop-blur-md transition hover:border-teal/50 hover:text-teal"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Resume
            </a>
            <div className="ml-1 flex items-center gap-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="grid h-11 w-11 place-items-center rounded-xl text-fg-muted transition hover:bg-surface-hover hover:text-fg"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="grid h-11 w-11 place-items-center rounded-xl text-fg-muted transition hover:bg-surface-hover hover:text-fg"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          data-scene-block
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 1.1, duration: 1, ease }}
          className="hidden self-end xl:block"
          style={{ transformPerspective: 1200 }}
        >
          <WhoamiTerminal />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-8 font-mono text-[11px] text-fg-dim md:px-8"
      >
        <span className="flex items-center gap-2">
          <span className="relative h-8 w-5 rounded-full border border-line-strong">
            <motion.span
              animate={{ y: [4, 14, 4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-0 h-1.5 w-1 -translate-x-1/2 rounded-full bg-teal"
            />
          </span>
          scroll to follow the request through the stack
        </span>
        <span className="hidden items-center gap-2 md:flex">
          <MousePointer2 className="h-3.5 w-3.5" />
          hover a node · click to jump
        </span>
      </motion.div>
    </section>
  );
}
