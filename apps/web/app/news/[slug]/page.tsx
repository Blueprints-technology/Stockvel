'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { NewsCard } from '@/components/market/news-card';
import { Card } from '@/components/ui/card';
import { fetchNewsItem } from '@/services/market';

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data } = useQuery({ queryKey: ['news-detail', slug], queryFn: () => fetchNewsItem(slug) });

  return (
    <AppShell>
      <div className="space-y-6">
        <Card className="space-y-4">
          <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">{data?.category?.name ?? data?.source}</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{data?.title}</h1>
          <p className="text-sm text-slate-500">{data?.excerpt}</p>
          <article className="prose max-w-none prose-slate">{data?.content}</article>
          <Link href={data?.sourceUrl ?? '#'} target="_blank" className="inline-flex rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Read original source</Link>
        </Card>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(data?.related ?? []).map((item: any) => <NewsCard key={item.id} item={item} />)}
        </section>
      </div>
    </AppShell>
  );
}
