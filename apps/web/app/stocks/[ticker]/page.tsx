'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { PriceChart } from '@/components/charts/price-chart';
import { CommentThread } from '@/components/comments/comment-thread';
import { NewsCard } from '@/components/market/news-card';
import { Card } from '@/components/ui/card';
import { compactNumber, currency, percentage } from '@/lib/utils';
import { fetchStock } from '@/services/market';

export default function StockDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = use(params);
  const { data } = useQuery({ queryKey: ['stock', ticker], queryFn: () => fetchStock(ticker) });

  return (
    <AppShell>
      <div className="space-y-6">
        <Card className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">{data?.sector}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{data?.companyName}</h1>
              <p className="mt-1 text-sm text-slate-500">{data?.ticker}</p>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-3xl font-semibold text-slate-950">{currency(data?.currentPrice ?? 0)}</p>
                <p className={data?.percentChange >= 0 ? 'text-success' : 'text-danger'}>{percentage(data?.percentChange ?? 0)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 sm:grid-cols-4">
                <div><p>Volume</p><p className="font-semibold text-slate-900">{compactNumber(data?.volume ?? 0)}</p></div>
                <div><p>Market cap</p><p className="font-semibold text-slate-900">{compactNumber(data?.marketCap ?? 0)}</p></div>
                <div><p>P/E</p><p className="font-semibold text-slate-900">{data?.peRatio?.toFixed?.(2) ?? '--'}</p></div>
                <div><p>Dividend yield</p><p className="font-semibold text-slate-900">{data?.dividendYield ? `${(data.dividendYield * 100).toFixed(2)}%` : '--'}</p></div>
              </div>
            </div>
            <PriceChart data={(data?.prices ?? []).map((point: any) => ({ date: point.date, close: point.close }))} positive={(data?.percentChange ?? 0) >= 0} />
          </div>
          <div className="space-y-4">
            <Card className="bg-slate-50"><p className="text-sm text-slate-500">52 week range</p><p className="mt-2 text-lg font-semibold text-slate-900">{currency(data?.week52Low ?? 0)} — {currency(data?.week52High ?? 0)}</p></Card>
            <Card className="bg-slate-50"><p className="text-sm text-slate-500">Related peers</p><div className="mt-3 space-y-2">{(data?.peers ?? []).map((peer: any) => <div key={peer.id} className="flex items-center justify-between text-sm"><span className="font-medium text-slate-900">{peer.ticker}</span><span className="text-slate-500">{currency(peer.currentPrice)}</span></div>)}</div></Card>
          </div>
        </Card>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(data?.relatedNews ?? []).map((item: any) => <NewsCard key={item.id} item={item} />)}
        </section>
        <CommentThread assetType="STOCK" assetSymbol={ticker.toUpperCase()} />
      </div>
    </AppShell>
  );
}
