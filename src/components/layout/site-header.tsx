"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import { journey, profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { MethodBadge } from "@/components/method-badge";
import { useActiveStop } from "@/components/scene/journey-store";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { cn } from "@/lib/utils";

const stops = journey.filter((s) => s.id !== "top");

export function SiteHeader({ variant = "home" }: { variant?: "home" | "page" }) {
  const active = useActiveStop();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const base = variant === "home" ? "" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-line bg-bg/70 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <ScrollProgress className="absolute top-auto bottom-0 h-px bg-linear-to-r from-teal via-blue to-violet" />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
          <Link
            href={variant === "home" ? "#top" : "/"}
            className="group flex items-center gap-3"
            aria-label={`${profile.name}, home`}
            onClick={() => setOpen(false)}
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-line-strong bg-surface-solid font-mono text-[13px] font-semibold tracking-tight">
              {profile.initials}
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-teal shadow-[0_0_10px_rgba(94,234,212,0.9)]" />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-medium">{profile.name}</span>
              <span className="font-mono text-[10.5px] text-fg-dim">backend · {profile.location.split(",")[0].toLowerCase()}</span>
            </span>
          </Link>

          <nav aria-label="Sections" className="hidden items-center lg:flex">
            <ul className="flex items-center gap-1 rounded-full border border-line bg-bg/50 p-1 backdrop-blur-md">
              {stops.map((stop) => {
                const isActive = variant === "home" && active === stop.id;
                return (
                  <li key={stop.id} className="relative">
                    <a
                      href={`${base}#${stop.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[12px] transition-colors",
                        isActive ? "text-fg" : "text-fg-dim hover:text-fg",
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-full border border-line-strong bg-surface-hover"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      ) : null}
                      {stop.path}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 w-9 place-items-center rounded-lg border border-line text-fg-muted transition hover:border-line-strong hover:text-fg sm:grid"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.resume}
              download
              className="group hidden items-center gap-2 rounded-lg border border-teal/30 bg-teal/10 px-3 py-2 text-[13px] font-medium text-teal transition hover:border-teal/60 hover:bg-teal/15 sm:flex"
            >
              <ArrowDownToLine className="h-3.5 w-3.5 transition group-hover:translate-y-0.5" />
              Resume
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-fg lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-bg/95 pt-20 backdrop-blur-xl lg:hidden"
            data-lenis-prevent
          >
            <nav aria-label="Sections" className="mx-auto max-w-lg px-6">
              <p className="kicker mb-4">trace · 7 spans</p>
              <ul className="divide-y divide-line border-y border-line">
                {journey.map((stop, i) => (
                  <motion.li
                    key={stop.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.35 }}
                  >
                    <a
                      href={`${base}#${stop.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 py-4 font-mono text-sm"
                    >
                      <span className="w-6 text-fg-dim">{String(i + 1).padStart(2, "0")}</span>
                      <MethodBadge method={stop.method} />
                      <span className={cn(variant === "home" && active === stop.id ? "text-teal" : "text-fg")}>{stop.path}</span>
                      <span className="ml-auto text-xs text-fg-dim">{stop.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <a href={profile.resume} download className="flex items-center justify-center gap-2 rounded-lg border border-teal/30 bg-teal/10 py-3 text-sm text-teal">
                  <ArrowDownToLine className="h-4 w-4" /> Resume
                </a>
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-line py-3 text-sm">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-line py-3 text-sm">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
