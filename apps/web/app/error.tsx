'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page-shell">
      <div className="glass-panel mx-auto max-w-2xl space-y-5 p-8 text-center">
        <div className="mx-auto inline-flex rounded-3xl bg-rose-50 p-4 text-rose-600">
          <AlertTriangle className="size-8" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">Runtime issue</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Something went wrong while rendering this page</h1>
          <p className="mt-3 text-slate-500">A guarded error boundary caught the problem. You can retry safely without losing the rest of the app shell.</p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          <RefreshCw className="size-4" /> Try again
        </button>
      </div>
    </main>
  );
}
