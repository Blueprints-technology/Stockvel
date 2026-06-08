export default function Loading() {
  return (
    <main className="page-shell">
      <div className="glass-panel space-y-4 p-6 sm:p-8">
        <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
        </div>
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    </main>
  );
}
