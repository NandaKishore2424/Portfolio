import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="grid-bg relative grid min-h-svh place-items-center px-5">
      <div className="w-full max-w-xl">
        <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface-solid font-mono text-[13px] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            <span className="ml-3 text-[11px] text-fg-dim">GET · unknown route</span>
          </div>
          <div className="space-y-1 p-5">
            <p className="text-rose">HTTP/1.1 404 Not Found</p>
            <p className="text-fg-dim">content-type: application/json</p>
            <p className="pt-2 text-fg-dim">{"{"}</p>
            <p className="pl-4">
              <span className="text-teal">&quot;status&quot;</span>: <span className="text-violet">404</span>,
            </p>
            <p className="pl-4">
              <span className="text-teal">&quot;error&quot;</span>: <span className="text-amber">&quot;Not Found&quot;</span>,
            </p>
            <p className="pl-4">
              <span className="text-teal">&quot;hint&quot;</span>:{" "}
              <span className="text-amber">&quot;this route never existed, or a refactor removed it&quot;</span>
            </p>
            <p className="text-fg-dim">{"}"}</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
