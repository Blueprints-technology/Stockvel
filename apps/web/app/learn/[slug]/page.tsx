'use client';

import { use } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, BookmarkCheck, BookOpen, Clock3, Eye, Sparkles } from 'lucide-react';
import { ArticleCard } from '@/components/content/article-card';
import { AppShell } from '@/components/layout/app-shell';
import { AnimatedBlock, AnimatedPage } from '@/components/ui/animated-page';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { QueryState } from '@/components/ui/query-state';
import { formatDate } from '@/lib/utils';
import { fetchLearnArticle, toggleLearnBookmark } from '@/services/market';
import { authStore } from '@/store/auth-store';

export default function LearnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const user = authStore((state) => state.user);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['learn-article', slug], queryFn: () => fetchLearnArticle(slug) });
  const bookmarkMutation = useMutation({
    mutationFn: async () => toggleLearnBookmark(slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['learn-article', slug] }),
  });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-brand shadow-sm">
                {data?.category?.name ?? 'Learning article'}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/learn" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Back to learn hub</Link>
                {user ? (
                  <button
                    type="button"
                    onClick={() => bookmarkMutation.mutate()}
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white"
                  >
                    {data?.isBookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                    {data?.isBookmarked ? 'Bookmarked' : 'Save article'}
                  </button>
                ) : (
                  <Link href="/login" className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white">Login to bookmark</Link>
                )}
              </div>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{data?.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{data?.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span>{data?.author}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="size-4" /> {data?.readTime ?? 0} min read</span>
              <span className="inline-flex items-center gap-1"><Eye className="size-4" /> {data?.viewCount ?? 0} views</span>
              <span>{formatDate(data?.publishedAt)}</span>
            </div>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState isLoading={isLoading} isError={isError} errorMessage="Unable to load this learning article." />
        </AnimatedBlock>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <AnimatedBlock>
            <Card className="space-y-5">
              {data?.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">#{tag}</span>)}
                </div>
              ) : null}
              <article className="whitespace-pre-line text-base leading-8 text-slate-700">{data?.content}</article>
            </Card>
          </AnimatedBlock>

          <AnimatedBlock>
            <div className="space-y-4">
              <Card className="space-y-4 bg-gradient-to-br from-white via-white to-blue-50/70">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-brand" />
                  <h2 className="text-xl font-semibold text-slate-950">Why this lesson matters</h2>
                </div>
                <p className="text-sm leading-7 text-slate-600">This page is designed as a durable content surface with bookmarking, related discovery, and quick navigation back into the wider learn hub.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Card className="bg-slate-50"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Category</p><p className="mt-2 font-semibold text-slate-900">{data?.category?.name ?? 'Learning'}</p></Card>
                  <Card className="bg-slate-50"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reader intent</p><p className="mt-2 font-semibold text-slate-900">Education and portfolio context</p></Card>
                </div>
              </Card>
              <Card className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-brand" />
                  <h2 className="text-xl font-semibold text-slate-950">Related lessons</h2>
                </div>
                {(data?.related ?? []).length ? (
                  <div className="grid gap-4">
                    {(data?.related ?? []).map((article) => <ArticleCard key={article.id} article={article} />)}
                  </div>
                ) : (
                  <EmptyState icon={BookOpen} title="No related lessons yet" description="Check back after more articles are added to the knowledge base." />
                )}
              </Card>
            </div>
          </AnimatedBlock>
        </div>
      </AnimatedPage>
    </AppShell>
  );
}
