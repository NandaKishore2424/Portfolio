"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useActiveStop } from "./journey-store";
import { JourneyTracker } from "./journey-tracker";

const TopologyScene = dynamic(() => import("./topology-scene"), { ssr: false });

let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

/**
 * Fixed, full-viewport WebGL layer behind the page. Content sections sit
 * above it; a dimming layer fades in once the reader leaves the hero.
 */
export function SceneCanvas() {
  // false on the server, the real answer on the client
  const supported = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const [ready, setReady] = useState(false);
  // Node labels render here, inside the fixed layer, so they move with the scene.
  const labelsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const active = useActiveStop();

  return (
    <>
      <JourneyTracker />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        {supported ? (
          <div
            ref={labelsRef}
            className={cn("absolute inset-0 transition-opacity duration-[1400ms]", ready ? "opacity-100" : "opacity-0")}
          >
            <TopologyScene reduced={reduced} labelsRef={labelsRef} onReady={() => setReady(true)} />
          </div>
        ) : null}

        {/* Fallback / base atmosphere, visible before WebGL paints */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            ready ? "opacity-0" : "opacity-100",
          )}
          style={{
            background:
              "radial-gradient(60% 50% at 70% 40%, rgba(94,234,212,0.10), transparent 70%), radial-gradient(50% 40% at 20% 70%, rgba(167,139,250,0.08), transparent 70%)",
          }}
        />

        {/* Readability: dim the scene while content sections are on screen */}
        <div
          className={cn(
            "absolute inset-0 bg-bg transition-opacity duration-700",
            active === "top" ? "opacity-0" : "opacity-55",
          )}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>
    </>
  );
}
