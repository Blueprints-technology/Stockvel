'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, LibraryBig, Mail, Radio } from 'lucide-react';
import { NewsletterForm } from '@/components/content/newsletter-form';
import { AppShell } from '@/components/layout/app-shell';
import { AnimatedBlock, AnimatedPage } from '@/components/ui/animated-page';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { QueryState } from '@/components/ui/query-state';
import { formatDate } from '@/lib/utils';
import { fetchLearnArticles, fetchResearchLatest } from '@/services/market';

const pillars = [
  { title: 'Learning picks', description: 'Selected educational explainers from the learn hub.', icon: BookOpen },
  { title: 'Research highlights', description: 'Fresh reports, market coverage, and strategy notes.', icon: LibraryBig },
  { title: 'Podcast briefings', description: 'Short audio briefings for busy investors and operators.', icon: Radio },
];

export default function NewsletterPage() {
  const latestQuery = useQuery({ queryKey: ['newsletter-latest'], queryFn: fetchResearchLatest });
  const learnQuery = useQuery({ queryKey: ['newsletter-learn-preview'], queryFn: () => fetchLearnArticles({ limit: 3 }) });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">Newsletter</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Subscribe to weekly market wraps, research picks, and learning drops</h1>
                <p className="mt-4 text-base leading-7 text-slate-600">This frontend surface connects to the implemented newsletter backend so users can subscribe, unsubscribe, and understand what content arrives in the weekly wrap.</p>
              </div>
              <Card className="bg-white/85">
                <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-brand"><Mail className="size-5" /></div>
                <p className="mt-4 text-sm text-slate-500">Typical newsletter mix</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>• 1 featured research note</p>
                  <p>• 1 podcast briefing</p>
                  <p>• 2 or more learning picks</p>
                </div>
              </Card>
            </div>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.title} className="space-y-3 border border-slate-200/70 bg-white/90">
                  <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-brand"><Icon className="size-5" /></div>
                  <h2 className="text-lg font-semibold text-slate-950">{pillar.title}</h2>
                  <p className="text-sm leading-6 text-slate-500">{pillar.description}</p>
                </Card>
              );
            })}
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <NewsletterForm />
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState
            isLoading={latestQuery.isLoading || learnQuery.isLoading}
            isError={latestQuery.isError || learnQuery.isError}
            errorMessage="Unable to load newsletter previews right now."
          />
        </AnimatedBlock>

        <div className="grid gap-6 xl:grid-cols-2">
          <AnimatedBlock>
            <Card className="space-y-4 bg-gradient-to-br from-white via-white to-blue-50/60">
              <div className="flex items-center gap-2">
                <Mail className="size-5 text-brand" />
                <h2 className="section-title">Upcoming in the next wrap</h2>
              </div>
              {(latestQuery.data ?? []).length ? (
                <div className="space-y-3">
                  {(latestQuery.data ?? []).map((entry, index) => {
                    const href = entry.kind === 'report' ? `/research/reports/${entry.item.slug}` : `/research/podcasts/${entry.item.slug}`;
                    return (
                      <Link key={`${entry.kind}-${index}`} href={href} className="block rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:bg-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{entry.kind}</p>
                        <p className="mt-1 font-semibold text-slate-900">{entry.item.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{formatDate(entry.date)}</p>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon={Mail} title="No newsletter preview items yet" description="Fresh research and podcast items will appear here once the feed updates." />
              )}
            </Card>
          </AnimatedBlock>

          <AnimatedBlock>
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-brand" />
                <h2 className="section-title">Learning articles often featured</h2>
              </div>
              {(learnQuery.data?.items ?? []).length ? (
                <div className="space-y-3">
                  {(learnQuery.data?.items ?? []).map((article) => (
                    <Link key={article.id} href={`/learn/${article.slug}`} className="block rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:bg-white">
                      <p className="text-sm font-semibold text-slate-900">{article.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{article.excerpt}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState icon={BookOpen} title="No learning previews yet" description="As new lessons are published, they will be highlighted here for newsletter subscribers." />
              )}
            </Card>
          </AnimatedBlock>
        </div>

        <AnimatedBlock>
          <div className="flex flex-wrap gap-3">
            <Link href="/learn" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">Explore learn hub</Link>
            <Link href="/research" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white">Open research desk <ArrowRight className="size-4" /></Link>
          </div>
        </AnimatedBlock>
      </AnimatedPage>
    </AppShell>
  );
}
