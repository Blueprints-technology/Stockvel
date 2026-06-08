"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Mic2, ReceiptText, Sparkles } from "lucide-react";
import { NewsletterForm } from "@/components/content/newsletter-form";
import { PodcastCard } from "@/components/content/podcast-card";
import { ReportCard } from "@/components/content/report-card";
import { AppShell } from "@/components/layout/app-shell";
import {
  AnimatedBlock,
  AnimatedPage,
  AnimatedCard,
  AnimatedSlide,
  AnimatedNumber,
} from "@/components/ui/animated-page";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryState } from "@/components/ui/query-state";
import { formatDate, percentage } from "@/lib/utils";
import {
  fetchPodcasts,
  fetchResearchLatest,
  fetchResearchReports,
  fetchTreasuries,
} from "@/services/market";

export default function ResearchPage() {
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const reportParams = useMemo(
    () => ({
      type: type || undefined,
      year: year ? Number(year) : undefined,
      limit: 12,
    }),
    [type, year],
  );

  const reportsQuery = useQuery({
    queryKey: ["research-reports", reportParams],
    queryFn: () => fetchResearchReports(reportParams),
  });
  const podcastsQuery = useQuery({
    queryKey: ["research-podcasts"],
    queryFn: fetchPodcasts,
  });
  const treasuriesQuery = useQuery({
    queryKey: ["research-treasuries"],
    queryFn: fetchTreasuries,
  });
  const latestQuery = useQuery({
    queryKey: ["research-latest"],
    queryFn: fetchResearchLatest,
  });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
                  Research
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Reports, podcasts, and fixed-income context in one place
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Use the research desk to compare formal reports, latest
                  episodes, and treasury-bill trends before making portfolio
                  decisions.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/newsletter"
                    className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
                  >
                    Subscribe to weekly wrap
                  </Link>
                  <Link
                    href="/learn"
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Go to learn hub
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <AnimatedCard>
                  <Card className="bg-white/85">
                    <p className="text-sm text-slate-500">Reports</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      <AnimatedNumber
                        value={String(reportsQuery.data?.pagination.total ?? 0)}
                      />
                    </p>
                  </Card>
                </AnimatedCard>
                <AnimatedCard>
                  <Card className="bg-white/85">
                    <p className="text-sm text-slate-500">Podcasts</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      <AnimatedNumber
                        value={String(podcastsQuery.data?.length ?? 0)}
                      />
                    </p>
                  </Card>
                </AnimatedCard>
                <AnimatedCard>
                  <Card className="bg-white/85">
                    <p className="text-sm text-slate-500">Treasury tenors</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      <AnimatedNumber
                        value={String(treasuriesQuery.data?.length ?? 0)}
                      />
                    </p>
                  </Card>
                </AnimatedCard>
                <AnimatedCard>
                  <Card className="bg-white/85">
                    <p className="text-sm text-slate-500">Latest updates</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">
                      <AnimatedNumber
                        value={String(latestQuery.data?.length ?? 0)}
                      />
                    </p>
                  </Card>
                </AnimatedCard>
              </div>
            </div>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <Card className="border border-slate-200/80 bg-white/90">
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none"
              >
                <option value="">All report types</option>
                <option value="MARKET_COVERAGE">Market coverage</option>
                <option value="ANALYSIS">Analysis</option>
                <option value="ECONOMY">Economy</option>
                <option value="STRATEGY">Strategy</option>
              </select>
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none"
              >
                <option value="">All years</option>
                {(reportsQuery.data?.years ?? []).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState
            isLoading={
              reportsQuery.isLoading ||
              podcastsQuery.isLoading ||
              treasuriesQuery.isLoading
            }
            isError={
              reportsQuery.isError ||
              podcastsQuery.isError ||
              treasuriesQuery.isError
            }
            errorMessage="Unable to load research surfaces right now."
          />
        </AnimatedBlock>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <AnimatedBlock>
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-5 text-brand" />
                <h2 className="section-title">Research reports</h2>
              </div>
              {(reportsQuery.data?.items ?? []).length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {(reportsQuery.data?.items ?? []).map((report) => (
                    <AnimatedCard key={report.id}>
                      <ReportCard report={report} />
                    </AnimatedCard>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={ReceiptText}
                  title="No research reports found"
                  description="Try clearing the type or year filters to widen the search."
                />
              )}
            </section>
          </AnimatedBlock>

          <AnimatedSlide from="right">
            <aside className="space-y-4">
              <Card className="space-y-4 bg-gradient-to-br from-white via-white to-blue-50/60">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-brand" />
                  <h3 className="text-xl font-semibold text-slate-950">
                    Treasury watch
                  </h3>
                </div>
                {(treasuriesQuery.data ?? []).length ? (
                  <div className="space-y-3">
                    {(treasuriesQuery.data ?? []).map((entry) => (
                      <AnimatedCard key={entry.tenor}>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900">
                              {entry.tenor}
                            </p>
                            <p
                              className={
                                entry.direction >= 0
                                  ? "text-sm font-semibold text-success"
                                  : "text-sm font-semibold text-danger"
                              }
                            >
                              {entry.direction >= 0 ? "+" : ""}
                              {entry.direction.toFixed(0)}
                            </p>
                          </div>
                          <p className="mt-2 text-2xl font-semibold text-slate-950">
                            <AnimatedNumber
                              value={percentage(entry.latestRate)}
                            />
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Updated {formatDate(entry.updatedAt)} •{" "}
                            {entry.source}
                          </p>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={BarChart3}
                    title="Treasury data unavailable"
                    description="Treasury bill summaries will appear here once the latest feed is present."
                  />
                )}
              </Card>
              <Card className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-brand" />
                  <h3 className="text-xl font-semibold text-slate-950">
                    Latest from the desk
                  </h3>
                </div>
                {(latestQuery.data ?? []).length ? (
                  <div className="space-y-3">
                    {(latestQuery.data ?? []).map((entry, index) => {
                      const href =
                        entry.kind === "report"
                          ? `/research/reports/${entry.item.slug}`
                          : `/research/podcasts/${entry.item.slug}`;
                      return (
                        <AnimatedCard key={`${entry.kind}-${index}`}>
                          <Link
                            href={href}
                            className="block rounded-2xl border border-slate-100 bg-slate-50 p-4"
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                              {entry.kind}
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                              {entry.item.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(entry.date)}
                            </p>
                          </Link>
                        </AnimatedCard>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={Sparkles}
                    title="No latest updates yet"
                    description="New reports and podcast briefings will be surfaced here automatically."
                  />
                )}
              </Card>
            </aside>
          </AnimatedSlide>
        </div>

        <AnimatedBlock>
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Mic2 className="size-5 text-brand" />
              <h2 className="section-title">Podcast briefings</h2>
            </div>
            {(podcastsQuery.data ?? []).length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {/* ✨ UPGRADE: AnimatedCard for podcast grid */}
                {(podcastsQuery.data ?? []).map((episode) => (
                  <AnimatedCard key={episode.id}>
                    <PodcastCard episode={episode} />
                  </AnimatedCard>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Mic2}
                title="No podcast briefings found"
                description="Podcast episodes will appear here as soon as the backend catalog is populated."
              />
            )}
          </section>
        </AnimatedBlock>

        <AnimatedBlock>
          <NewsletterForm />
        </AnimatedBlock>
      </AnimatedPage>
    </AppShell>
  );
}
