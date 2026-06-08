'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Headphones, Radio, Sparkles, Waves } from 'lucide-react';
import { PodcastCard } from '@/components/content/podcast-card';
import { AppShell } from '@/components/layout/app-shell';
import { AnimatedBlock, AnimatedPage } from '@/components/ui/animated-page';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { QueryState } from '@/components/ui/query-state';
import { formatDate, formatDuration } from '@/lib/utils';
import { fetchPodcast, fetchPodcasts } from '@/services/market';

export default function PodcastDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const episodeQuery = useQuery({ queryKey: ['podcast-episode', slug], queryFn: () => fetchPodcast(slug) });
  const relatedQuery = useQuery({ queryKey: ['podcast-episodes'], queryFn: fetchPodcasts });
  const episode = episodeQuery.data;

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/research" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                <ArrowLeft className="size-4" /> Back to research
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Radio className="size-3.5" /> Podcast briefing
              </div>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{episode?.title}</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{episode?.description}</p>
              </div>
              <div className="hidden rounded-3xl bg-white/85 p-4 text-emerald-700 shadow-sm md:block">
                <Headphones className="size-8" />
              </div>
            </div>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState isLoading={episodeQuery.isLoading} isError={episodeQuery.isError} errorMessage="Unable to load this podcast episode." />
        </AnimatedBlock>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <AnimatedBlock>
            <Card className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Episode</p><p className="mt-2 font-semibold text-slate-900">S{episode?.seasonNumber ?? 1}E{episode?.episodeNumber ?? 1}</p></Card>
                <Card className="bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Duration</p><p className="mt-2 font-semibold text-slate-900">{formatDuration(episode?.duration ?? 0)}</p></Card>
                <Card className="bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Published</p><p className="mt-2 font-semibold text-slate-900">{formatDate(episode?.publishedAt)}</p></Card>
                <Card className="bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Plays</p><p className="mt-2 font-semibold text-slate-900">{episode?.playCount ?? 0}</p></Card>
              </div>

              {episode?.audioUrl ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><Waves className="size-4 text-brand" /> Audio player</div>
                  <audio controls className="w-full">
                    <source src={episode.audioUrl} />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              ) : (
                <EmptyState icon={Radio} title="Audio unavailable" description="This episode is present in the catalog, but the audio file URL is missing." />
              )}

              {episode?.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {episode.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">#{tag}</span>)}
                </div>
              ) : null}
            </Card>
          </AnimatedBlock>

          <AnimatedBlock>
            <Card className="space-y-4 bg-gradient-to-br from-white via-white to-emerald-50/60">
              <div className="flex items-center gap-2"><Sparkles className="size-5 text-brand" /><h2 className="text-xl font-semibold text-slate-950">More podcast briefings</h2></div>
              {((relatedQuery.data ?? []).filter((item) => item.slug != slug).slice(0, 3)).length ? (
                <div className="grid gap-4">
                  {(relatedQuery.data ?? []).filter((item) => item.slug !== slug).slice(0, 3).map((item) => (
                    <PodcastCard key={item.id} episode={item} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={Headphones} title="No related podcast briefings yet" description="Additional episodes will appear here when the audio library expands." />
              )}
            </Card>
          </AnimatedBlock>
        </div>
      </AnimatedPage>
    </AppShell>
  );
}
