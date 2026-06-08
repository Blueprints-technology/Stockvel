"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Coins, Layers3, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AssetTable } from "@/components/market/asset-table";
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
import { compactNumber } from "@/lib/utils";
import { fetchSectorCategory } from "@/services/market";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sector-category", slug],
    queryFn: () => fetchSectorCategory(slug),
  });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
                  Theme detail
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {data?.name ?? "Category"}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                  {data?.description ??
                    "View the stock and crypto assets mapped to this market theme."}
                </p>
              </div>

              <AnimatedSlide from="right">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <ArrowLeft className="size-4" /> Back to themes
                </Link>
              </AnimatedSlide>
            </div>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState
            isLoading={isLoading}
            isError={isError}
            errorMessage="Unable to load this sector category."
          />
        </AnimatedBlock>

        <AnimatedBlock>
          <div className="grid gap-4 md:grid-cols-3">
            <AnimatedCard className="h-full">
              <Card className="h-full space-y-2 bg-white/90">
                <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-brand">
                  <Layers3 className="size-5" />
                </div>
                <p className="text-sm text-slate-500">Stock ideas</p>
                <p className="text-2xl font-semibold text-slate-950">
                  <AnimatedNumber value={String(data?.stocks?.length ?? 0)} />
                </p>
              </Card>
            </AnimatedCard>

            <AnimatedCard className="h-full">
              <Card className="h-full space-y-2 bg-white/90">
                <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <Coins className="size-5" />
                </div>
                <p className="text-sm text-slate-500">Crypto ideas</p>
                <p className="text-2xl font-semibold text-slate-950">
                  <AnimatedNumber value={String(data?.crypto?.length ?? 0)} />
                </p>
              </Card>
            </AnimatedCard>

            <AnimatedCard className="h-full">
              <Card className="h-full space-y-2 bg-white/90">
                <div className="inline-flex rounded-2xl bg-amber-50 p-3 text-amber-700">
                  <TrendingUp className="size-5" />
                </div>
                <p className="text-sm text-slate-500">Combined coverage</p>
                <p className="text-2xl font-semibold text-slate-950">
                  <AnimatedNumber
                    value={compactNumber(
                      (data?.stocks?.length ?? 0) + (data?.crypto?.length ?? 0),
                    )}
                  />
                </p>
              </Card>
            </AnimatedCard>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Mapped stocks</h2>
              <p className="text-sm text-slate-400">
                Sorted by strongest daily momentum
              </p>
            </div>

            {isLoading ? (
              <AssetTable
                title="Stocks in this theme"
                items={[]}
                type="stocks"
                isLoading
              />
            ) : data?.stocks?.length ? (
              <AssetTable
                title="Stocks in this theme"
                items={data.stocks}
                type="stocks"
              />
            ) : (
              !isError && (
                <EmptyState
                  icon={Layers3}
                  title="No stock assets mapped yet"
                  description="This theme currently has no stock entries associated with it."
                />
              )
            )}
          </section>
        </AnimatedBlock>

        <AnimatedBlock>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Mapped crypto assets</h2>
              <p className="text-sm text-slate-400">
                Cross-asset context for the same theme
              </p>
            </div>

            {isLoading ? (
              <AssetTable
                title="Crypto in this theme"
                items={[]}
                type="crypto"
                isLoading
              />
            ) : data?.crypto?.length ? (
              <AssetTable
                title="Crypto in this theme"
                items={data.crypto}
                type="crypto"
              />
            ) : (
              !isError && (
                <EmptyState
                  icon={Coins}
                  title="No crypto assets mapped yet"
                  description="This theme currently has no crypto entries associated with it."
                />
              )
            )}
          </section>
        </AnimatedBlock>
      </AnimatedPage>
    </AppShell>
  );
}
