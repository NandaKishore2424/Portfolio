"use client";

import { useSyncExternalStore } from "react";
import { journey } from "@/content/profile";

/**
 * Tiny external store shared by the DOM and the WebGL scene.
 * `progress` is a float in [0, journey.length - 1]: the integer part is the
 * current stop, the fraction is how far the camera is toward the next one.
 * The scene reads it every frame without re-rendering React.
 */
type JourneyState = {
  progress: number;
  active: (typeof journey)[number]["id"];
  hovered: string | null;
};

let state: JourneyState = { progress: 0, active: "top", hovered: null };
const listeners = new Set<() => void>();

export const journeyStore = {
  get: () => state,
  set(partial: Partial<JourneyState>) {
    const next = { ...state, ...partial };
    const changed = next.active !== state.active || next.hovered !== state.hovered;
    state = next;
    if (changed) listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useActiveStop() {
  return useSyncExternalStore(
    journeyStore.subscribe,
    () => journeyStore.get().active,
    () => "top" as const,
  );
}

export function useHoveredNode() {
  return useSyncExternalStore(
    journeyStore.subscribe,
    () => journeyStore.get().hovered,
    () => null,
  );
}
