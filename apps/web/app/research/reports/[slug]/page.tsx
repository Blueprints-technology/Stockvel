'use client';

import { use } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download, FileText, Lock, Sparkles } from 'lucide-react';
import { ReportCard } from '@/components/content/report-card';
import { AppShell } from '@/components/layout/app-shell';
import { AnimatedBlock, AnimatedPage } from '@/components/ui/animated-page';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { QueryState } from '@/components/ui/query-state';
import { formatDate } from '@/lib/utils';
import { fetchResearchReport, fetchResearchReports, trackResearchDownload } from '@/services/market';

export default function ResearchReportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const queryClient = useQueryClient();
  const reportQuery = useQuery({ queryKey: ['research-report', slug], queryFn: () => fetchResearchReport(slug) });
  const relatedQuery = useQuery({ queryKey: ['research-reports-related'], queryFn: () => fetchResearchReports({ limit: 4 }) });
  const downloadMutation = useMutation({
    mutationFn: async () => trackResearchDownload(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-report', slug] });
      queryClient.invalidateQueries({ queryKey: ['research-reports-related'] });
    },
  });

  const report = reportQuery.data;

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/research" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                <ArrowLeft className="size-4" /> Back to research
              </Link>
              <button
                type="button"
                onClick={() => downloadMutation.mutate()}
                disabled={downloadMutation.isPending}
                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Download className="size-4" /> {downloadMutation.isPending ? 'Recording…' : 'Track download'}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <FileText className="size-3.5" /> {report?.type?.replaceAll('_', ' ') ?? 'Research report'}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                {report?.isPremium ? <Lock className="size-3.5" /> : <Sparkles className="size-3.5" />}
                {report?.isPremium ? 'Premium access' : 'Open access'}
              </div>
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{report?.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{report?.summary}</p>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState isLoading={reportQuery.isLoading} isError={reportQuery.isError} errorMessage="Unable to load this research report." />
        </AnimatedBlock>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <AnimatedBlock>
            <Card className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Author</p><p className="mt-2 font-semibold text-slate-900">{report?.author}</p></Card>
                <Card className="bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Report date</p><p className="mt-2 font-semibold text-slate-900">{formatDate(report?.reportDate)}</p></Card>
                <Card className="bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Year</p><p className="mt-2 font-semibold text-slate-900">{report?.reportYear ?? '—'}</p></Card>
                <Card className="bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Downloads</p><p className="mt-2 font-semibold text-slate-900">{report?.downloadCount ?? 0}</p></Card>
              </div>

              {report?.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">#{tag}</span>)}
                </div>
              ) : null}

              <article className="whitespace-pre-line text-base leading-8 text-slate-700">{report?.content}</article>

              {report?.pdfUrl ? (
                <a href={report.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                  Open attached PDF <Download className="size-4" />
                </a>
              ) : (
                <EmptyState icon={FileText} title="No PDF attached" description="This report currently renders from its stored content body only." />
              )}
            </Card>
          </AnimatedBlock>

          <AnimatedBlock>
            <Card className="space-y-4 bg-gradient-to-br from-white via-white to-indigo-50/60">
              <div className="flex items-center gap-2"><Sparkles className="size-5 text-brand" /><h2 className="text-xl font-semibold text-slate-950">More reports</h2></div>
              {((relatedQuery.data?.items ?? []).filter((item) => item.slug != slug).slice(0, 3)).length ? (
                <div className="grid gap-4">
                  {(relatedQuery.data?.items ?? []).filter((item) => item.slug !== slug).slice(0, 3).map((item) => (
                    <ReportCard key={item.id} report={item} />
                  ))}
                </div>
              ) : (
                <EmptyState icon={Sparkles} title="No related reports yet" description="Additional research reports will appear here as the catalog grows." />
              )}
            </Card>
          </AnimatedBlock>
        </div>
      </AnimatedPage>
    </AppShell>
  );
}
