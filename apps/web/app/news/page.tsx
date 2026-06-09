"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { NewsCard } from "@/components/market/news-card";
import { fetchNews } from "@/services/market";

export default function NewsPage() {
  const [category, setCategory] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["news", category],
    queryFn: () => fetchNews({ category: category || undefined }),
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
              News
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Nigerian financial and crypto headlines
            </h1>
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none"
          >
            <option value="">All categories</option>
            <option value="equities">Equities</option>
            <option value="crypto">Crypto</option>
            <option value="economy">Economy</option>
            <option value="education">Education</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((item: any) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
