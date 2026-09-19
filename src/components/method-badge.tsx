import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  GET: "text-teal border-teal/30 bg-teal/10",
  POST: "text-amber border-amber/30 bg-amber/10",
  PUT: "text-blue border-blue/30 bg-blue/10",
  DELETE: "text-rose border-rose/30 bg-rose/10",
};

export function MethodBadge({ method, className }: { method: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider",
        tones[method] ?? tones.GET,
        className,
      )}
    >
      {method}
    </span>
  );
}
