"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ArticleCard } from "@/components/content/article-card";
import { NewsletterForm } from "@/components/content/newsletter-form";
import { AppShell } from "@/components/layout/app-shell";
import { AnimatedBlock, AnimatedPage } from "@/components/ui/animated-page";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryState } from "@/components/ui/query-state";
import { formatDate } from "@/lib/utils";
import { fetchLearnArticles } from "@/services/market";

export default function LearnPage() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const params = useMemo(
    () => ({
      category: category || undefined,
      q: search || undefined,
      limit: 12,
    }),
    [category, search],
  );
  const { data, isLoading, isError } = useQuery({
    queryKey: ["learn-articles", params],
    queryFn: () => fetchLearnArticles(params),
  });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
                  Learn
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Practical investing education for Nigerian market participants
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Browse explainers, portfolio lessons, treasury-bill primers,
                  and crypto education that connect directly to the rest of the
                  platform.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/research"
                    className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
                  >
                    Open research desk
                  </Link>
                  <Link
                    href="/newsletter"
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Get weekly wrap
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <Card className="bg-white/85">
                  <p className="text-sm text-slate-500">Published lessons</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {data?.pagination.total ?? 0}
                  </p>
                </Card>
                <Card className="bg-white/85">
                  <p className="text-sm text-slate-500">Categories</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {data?.categories.length ?? 0}
                  </p>
                </Card>
                <Card className="bg-white/85">
                  <p className="text-sm text-slate-500">Trending now</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {data?.trending.length ?? 0}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <Card className="border border-slate-200/80 bg-white/90">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search articles, tags, or lessons"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none ring-brand/20 transition focus:ring"
                />
              </div>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none"
              >
                <option value="">All categories</option>
                {(data?.categories ?? []).map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                {data?.pagination.total ?? 0} results
              </div>
            </div>
          </Card>
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState
            isLoading={isLoading}
            isError={isError}
            errorMessage="Unable to load learning content right now."
          />
        </AnimatedBlock>

        {data?.featured ? (
          <AnimatedBlock>
            <Card className="grid gap-6 overflow-hidden border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-white lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  <GraduationCap className="size-4" /> Featured lesson
                </div>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                    {data.featured.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-slate-600">
                    {data.featured.excerpt}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{data.featured.author}</span>
                  <span>•</span>
                  <span>{formatDate(data.featured.publishedAt)}</span>
                  <span>•</span>
                  <span>{data.featured.readTime} min read</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(data.featured.tags ?? []).slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/learn/${data.featured.slug}`}
                  className="inline-flex rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Read featured article
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Card className="bg-white/85">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Sparkles className="size-4 text-brand" /> Featured
                    collection
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Best starting point for a first-time learner.
                  </p>
                </Card>
                <Card className="bg-white/85">
                  <div className="flex items-center gap-2 text-slate-500">
                    <TrendingUp className="size-4 text-success" /> Trending
                    context
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Use this lesson alongside research and news pages for market
                    context.
                  </p>
                </Card>
              </div>
            </Card>
          </AnimatedBlock>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <AnimatedBlock>
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="section-title">All learning articles</h2>
                <p className="text-sm text-slate-400">
                  Page {data?.pagination.page ?? 1} of{" "}
                  {data?.pagination.totalPages ?? 1}
                </p>
              </div>
              {(data?.items ?? []).length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {(data?.items ?? []).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No lessons matched your filters"
                  description="Try clearing the search term or switching back to all categories."
                />
              )}
            </section>
          </AnimatedBlock>

          <AnimatedBlock>
            <aside className="space-y-4">
              <Card className="space-y-4 bg-gradient-to-br from-white via-white to-blue-50/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-brand" />
                  <h3 className="text-xl font-semibold text-slate-950">
                    Trending now
                  </h3>
                </div>
                {(data?.trending ?? []).length ? (
                  <div className="space-y-3">
                    {(data?.trending ?? []).map((article) => (
                      <Link
                        key={article.id}
                        href={`/learn/${article.slug}`}
                        className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-white"
                      >
                        <p className="font-semibold text-slate-900">
                          {article.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {article.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={TrendingUp}
                    title="Trending list unavailable"
                    description="Featured lessons will appear here once article data loads."
                  />
                )}
              </Card>
              <NewsletterForm />
            </aside>
          </AnimatedBlock>
        </div>
      </AnimatedPage>
    </AppShell>
  );
}
