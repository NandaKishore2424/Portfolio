"use client";

// Adapted from Aceternity UI's Timeline (sticky titles + scroll-following beam),
// restyled for this site and stripped of its demo header.
import { motion, useScroll, useTransform } from "motion/react";
import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TimelineEntry {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export const Timeline = ({ data, className }: { data: TimelineEntry[]; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => setHeight(el.getBoundingClientRect().height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 30%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  return (
    <div className={cn("w-full", className)} ref={containerRef}>
      <div ref={ref} className="relative">
        {data.map((item) => (
          <div key={item.id} className="flex justify-start pt-10 md:gap-10 md:pt-28 first:md:pt-10">
            <div className="sticky top-32 z-10 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg">
                <div className="h-3 w-3 rounded-full border border-teal/60 bg-teal/20 shadow-[0_0_12px_rgba(94,234,212,0.6)]" />
              </div>
              <div className="hidden md:block md:pl-16">{item.title}</div>
            </div>

            <div className="relative w-full pl-14 md:pl-0">
              <div className="mb-4 block md:hidden">{item.title}</div>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-5 top-0 w-[2px] -translate-x-1/2 overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-line-strong to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-teal from-[0%] via-blue via-[12%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
