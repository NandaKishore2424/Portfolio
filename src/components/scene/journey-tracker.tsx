"use client";

import { useEffect } from "react";
import { journey } from "@/content/profile";
import { smoothstep } from "@/lib/utils";
import { journeyStore } from "./journey-store";

/**
 * Maps the scroll position to a continuous journey progress. The camera holds
 * on a stop for most of its section and travels during the last stretch, so
 * the scene feels like it moves *between* sections.
 */
export function JourneyTracker() {
  useEffect(() => {
    let tops: number[] = [];
    let frame = 0;

    const measure = () => {
      tops = journey.map((stop) => {
        const el = document.getElementById(stop.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      update();
    };

    const update = () => {
      frame = 0;
      if (!tops.length) return;
      const probe = window.scrollY + window.innerHeight * 0.45;
      let i = 0;
      while (i < tops.length - 1 && probe >= tops[i + 1]) i++;

      const start = tops[i];
      const end = i < tops.length - 1 ? tops[i + 1] : start + window.innerHeight;
      const local = (probe - start) / Math.max(1, end - start);
      const travel = i < tops.length - 1 ? smoothstep(0.55, 1, local) : 0;

      // Near the bottom of the page the last stop can't reach the probe line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const index = atBottom ? tops.length - 1 : i;

      journeyStore.set({
        progress: atBottom ? tops.length - 1 : i + travel,
        active: journey[index].id,
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
