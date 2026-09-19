"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownToLine, ArrowUpRight, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/section-heading";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";

const FORM_ENDPOINT = "https://formspree.io/f/xkgjadjy";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; code: number | null; message: string };

const channels = [
  { icon: Mail, label: "email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "phone", value: profile.phone, href: profile.phoneHref },
  { icon: LinkedinIcon, label: "linkedin", value: "in/nanda-kishore-7290551b8", href: profile.linkedin },
  { icon: GithubIcon, label: "github", value: profile.githubHandle, href: profile.github },
  { icon: MapPin, label: "location", value: profile.location },
];

function Field({
  name,
  label,
  type = "text",
  placeholder,
  multiline,
  required = true,
  last,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  last?: boolean;
}) {
  const common =
    "w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-amber placeholder:text-fg-dim/70 focus:border-line-strong focus:bg-bg/60 focus:outline-none";
  return (
    <label className={cn("flex gap-2 pl-4", multiline ? "items-start" : "items-center")}>
      <span className="shrink-0 pt-1 text-teal">&quot;{label}&quot;</span>
      <span className="shrink-0 pt-1 text-fg-dim">:</span>
      {multiline ? (
        <textarea name={name} required={required} rows={5} placeholder={placeholder} className={cn(common, "resize-y")} />
      ) : (
        <input name={name} type={type} required={required} placeholder={placeholder} className={common} autoComplete={type === "email" ? "email" : name} />
      )}
      {last ? null : <span className="pt-1 text-fg-dim">,</span>}
    </label>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        form.reset();
        setStatus({ kind: "ok" });
      } else {
        const data = (await res.json().catch(() => null)) as { errors?: { message: string }[] } | null;
        setStatus({
          kind: "error",
          code: res.status,
          message: data?.errors?.map((x) => x.message).join(", ") || "The form service rejected the request.",
        });
      }
    } catch {
      setStatus({ kind: "error", code: null, message: "Network error: the request never reached the server." });
    }
  }

  return (
    <section id="contact" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          method="POST"
          path="/contact"
          index="07 / 07"
          title="The request comes back to you."
          accent="Send one of your own."
          lede="Hiring for a backend role, or want to talk about Spring Boot, PostgreSQL or messaging? The form works, and so does email."
        />

        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="panel flex flex-col p-6 md:p-8"
          >
            <p className="kicker">Direct channels</p>
            <ul className="mt-5 space-y-1">
              {channels.map((c) => {
                const Icon = c.icon;
                const inner = (
                  <>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-bg/60 text-fg-muted transition group-hover:border-teal/40 group-hover:text-teal">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[10.5px] text-fg-dim">{c.label}</span>
                      <span className="block truncate text-[15px]">{c.value}</span>
                    </span>
                    {c.href ? <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-fg-dim transition group-hover:text-teal" /> : null}
                  </>
                );
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-surface-hover"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-3 p-2">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <a
              href={profile.resume}
              download
              className="group mt-6 flex items-center justify-between rounded-xl border border-teal/30 bg-teal/10 p-4 text-teal transition hover:bg-teal/15 lg:mt-auto"
            >
              <span>
                <span className="block font-medium">Download resume</span>
                <span className="block font-mono text-[11px] text-teal/70">Nanda_Kishore_Resume.pdf</span>
              </span>
              <ArrowDownToLine className="h-5 w-5 transition group-hover:translate-y-0.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative overflow-hidden rounded-[var(--radius-xl)] border border-line-strong bg-[linear-gradient(180deg,rgba(13,18,28,0.96),rgba(7,10,16,0.97))]"
          >
            <form onSubmit={onSubmit} className="font-mono text-[13px]">
              <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
                <span className="rounded-md border border-amber/30 bg-amber/10 px-1.5 py-0.5 text-[11px] font-semibold text-amber">
                  POST
                </span>
                <span className="text-fg-muted">/contact</span>
                <span className="ml-auto text-[11px] text-fg-dim">content-type: application/json</span>
              </div>

              <div className="space-y-2 px-4 py-5">
                <p className="text-fg-dim">{"{"}</p>
                <Field name="name" label="name" placeholder="Your name" />
                <Field name="email" label="email" type="email" placeholder="you@company.com" />
                <Field name="subject" label="subject" placeholder="Backend role at …" required={false} />
                <Field name="message" label="message" placeholder="What would you like to talk about?" multiline last />
                <p className="text-fg-dim">{"}"}</p>
                {/* Honeypot for bots */}
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
                <span className="text-[11px] text-fg-dim">Sent through Formspree. Replies come from my own inbox.</span>
                <button
                  type="submit"
                  disabled={status.kind === "sending"}
                  className="group inline-flex items-center gap-2 rounded-lg bg-fg px-4 py-2 font-sans text-sm font-semibold text-bg transition hover:bg-white disabled:opacity-60"
                >
                  {status.kind === "sending" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  )}
                  Send request
                </button>
              </div>
            </form>

            <div aria-live="polite" className="border-t border-line bg-bg/60 px-4 py-3 font-mono text-[12.5px]">
              <AnimatePresence mode="wait">
                {status.kind === "idle" ? (
                  <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-fg-dim">
                    ← response will appear here
                  </motion.p>
                ) : status.kind === "sending" ? (
                  <motion.p key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-fg-muted">
                    … awaiting response
                  </motion.p>
                ) : status.kind === "ok" ? (
                  <motion.div key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <p className="text-green">HTTP/1.1 200 OK</p>
                    <p className="mt-1 text-fg-muted">
                      {"{ "}
                      <span className="text-teal">&quot;status&quot;</span>: <span className="text-amber">&quot;delivered&quot;</span>,{" "}
                      <span className="text-teal">&quot;message&quot;</span>:{" "}
                      <span className="text-amber">&quot;Thanks, I&apos;ll get back to you soon.&quot;</span>
                      {" }"}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="err" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <p className="text-rose">{status.code ? `HTTP/1.1 ${status.code}` : "ERR_NETWORK"}</p>
                    <p className="mt-1 text-fg-muted">
                      {status.message} Email me instead:{" "}
                      <a className="text-teal underline" href={`mailto:${profile.email}`}>
                        {profile.email}
                      </a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <BorderBeam size={180} duration={10} colorFrom="#fbbf24" colorTo="#5eead4" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
