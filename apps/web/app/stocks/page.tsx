'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { AssetTable } from '@/components/market/asset-table';
import { fetchStocks } from '@/services/market';

export default function StocksPage() {
  const [sector, setSector] = useState('');
  const { data } = useQuery({ queryKey: ['stocks', sector], queryFn: () => fetchStocks({ sector: sector || undefined }) });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">NGX stocks</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Nigerian stock market listings</h1>
          </div>
          <select value={sector} onChange={(event) => setSector(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none">
            <option value="">All sectors</option>
            {(data?.sectors ?? []).map((item: string) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <AssetTable title="All listed stocks" items={data?.items ?? []} type="stocks" />
      </div>
    </AppShell>
  );
}
