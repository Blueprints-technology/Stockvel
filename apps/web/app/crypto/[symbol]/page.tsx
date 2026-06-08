"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { PriceChart } from "@/components/charts/price-chart";
import { CommentThread } from "@/components/comments/comment-thread";
import { NewsCard } from "@/components/market/news-card";
import { Card } from "@/components/ui/card";
import {
  AnimatedBlock,
  AnimatedPage,
  AnimatedCard,
  AnimatedNumber,
} from "@/components/ui/animated-page";
import { compactNumber, currency, percentage } from "@/lib/utils";
import { fetchCryptoAsset } from "@/services/market";

export default function CryptoDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = use(params);
  const { data } = useQuery({
    queryKey: ["crypto-asset", symbol],
    queryFn: () => fetchCryptoAsset(symbol),
  });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <Card className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
                  Cryptocurrency
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  {data?.name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{data?.symbol}</p>
              </div>

              <div>
                <AnimatedNumber
                  value={currency(data?.currentPrice ?? 0, "USD")}
                  className="text-3xl font-semibold text-slate-950"
                />
                <AnimatedNumber
                  value={percentage(data?.change24h ?? 0)}
                  className={
                    data?.change24h >= 0 ? "text-success" : "text-danger"
                  }
                />
              </div>

              <PriceChart
                data={(data?.prices ?? []).map((point: any) => ({
                  date: point.date,
                  close: point.close,
                }))}
                positive={(data?.change24h ?? 0) >= 0}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="bg-slate-50">
                <p className="text-sm text-slate-500">Market cap</p>
                <AnimatedNumber
                  value={currency(data?.marketCap ?? 0, "USD")}
                  className="mt-2 text-xl font-semibold text-slate-900"
                />
              </Card>
              <Card className="bg-slate-50">
                <p className="text-sm text-slate-500">24h volume</p>
                <AnimatedNumber
                  value={currency(data?.volume24h ?? 0, "USD")}
                  className="mt-2 text-xl font-semibold text-slate-900"
                />
              </Card>
              <Card className="bg-slate-50">
                <p className="text-sm text-slate-500">Circulating supply</p>
                <AnimatedNumber
                  value={compactNumber(data?.circulatingSupply ?? 0)}
                  className="mt-2 text-xl font-semibold text-slate-900"
                />
              </Card>
            </div>
          </Card>
        </AnimatedBlock>

        <AnimatedBlock>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(data?.relatedNews ?? []).map((item: any) => (
              <AnimatedCard key={item.id} className="h-full">
                <NewsCard item={item} />
              </AnimatedCard>
            ))}
          </section>
        </AnimatedBlock>

        <AnimatedBlock>
          <CommentThread
            assetType="CRYPTO"
            assetSymbol={symbol.toUpperCase()}
          />
        </AnimatedBlock>
      </AnimatedPage>
    </AppShell>
  );
}
