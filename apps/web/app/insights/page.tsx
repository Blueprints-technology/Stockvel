"use client";

import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { NewsCard } from "@/components/market/news-card";
import { AnimatedBlock, AnimatedPage } from "@/components/ui/animated-page";
import { EmptyState } from "@/components/ui/empty-state";
import { QueryState } from "@/components/ui/query-state";
import { fetchInsights } from "@/services/market";

export default function InsightsPage() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["insights"],
    queryFn: fetchInsights,
  });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
                Market insights
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Daily explainers and investment context
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Use insights to understand macro changes, sector rotation, and
                crypto momentum before you update your watchlist or portfolio.
              </p>
            </div>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState
            isLoading={isLoading}
            isError={isError}
            errorMessage="Unable to load market insights right now."
          />
        </AnimatedBlock>

        <AnimatedBlock>
          {data.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.map((item: any) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            !isLoading && (
              <EmptyState
                icon={Sparkles}
                title="No insights available yet"
                description="Market insights and explainers will appear here as soon as they are curated."
              />
            )
          )}
        </AnimatedBlock>
      </AnimatedPage>
    </AppShell>
  );
}
