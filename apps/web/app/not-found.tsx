// apps/web/app/not-found.tsx
export const dynamic = "force-dynamic"; // ✅ Add this line FIRST

import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="glass-panel mx-auto max-w-2xl space-y-5 p-8 text-center">
        <div className="mx-auto inline-flex rounded-3xl bg-blue-50 p-4 text-brand">
          <SearchX className="size-8" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
            Not found
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            The page or resource you requested was not found
          </h1>
          <p className="mt-3 text-slate-500">
            Try returning to the overview, browsing the learn hub, or opening
            the research desk.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/home"
            className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            Go to overview
          </Link>
          <Link
            href="/learn"
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Learn hub
          </Link>
          <Link
            href="/research"
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Research desk
          </Link>
        </div>
      </div>
    </main>
  );
}
