"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function CaseToc({ items }: { items: { id: string; title: string; kicker: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="kicker mb-3">On this page</p>
      <ul className="relative space-y-0.5 border-l border-line">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="relative">
              {isActive ? (
                <motion.span layoutId="toc-active" className="absolute -left-px top-0 h-full w-0.5 bg-teal" />
              ) : null}
              <a
                href={`#${item.id}`}
                className={cn(
                  "block py-1.5 pl-4 text-[13px] leading-snug transition-colors",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                <span className="block font-mono text-[10px] text-fg-dim">{item.kicker.split(" · ")[0]}</span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
