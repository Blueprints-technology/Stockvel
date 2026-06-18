"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, LibraryBig, Mail, Shapes } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { NewsletterForm } from "@/components/content/newsletter-form";
import { InstantSearch } from "@/components/market/instant-search";
import { AssetTable } from "@/components/market/asset-table";
import { NewsCard } from "@/components/market/news-card";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import {
  AnimatedPage,
  AnimatedBlock,
  AnimatedCard,
} from "@/components/ui/animated-page";
import { compactNumber, currency } from "@/lib/utils";
import { fetchOverview } from "@/services/market";
import { useSocket } from "@/hooks/use-socket";

const hubLinks = [
  {
    href: "/learn",
    title: "Learn hub",
    description:
      "Read explainers on dividends, treasury bills, and crypto basics.",
    icon: BookOpen,
  },
  {
    href: "/research",
    title: "Research desk",
    description: "Browse reports, podcasts, and treasury-bill market context.",
    icon: LibraryBig,
  },
  {
    href: "/categories",
    title: "Theme categories",
    description: "Jump into sector and multi-asset category leadership.",
    icon: Shapes,
  },
  {
    href: "/newsletter",
    title: "Newsletter",
    description: "Subscribe to weekly market wraps and learning picks.",
    icon: Mail,
  },
];

export default function HomePage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["overview"], queryFn: fetchOverview });
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams?.get("q") ?? "",
  );

  useSocket("market:overview", () =>
    queryClient.invalidateQueries({ queryKey: ["overview"] }),
  );
  useSocket("stock:price-update", () =>
    queryClient.invalidateQueries({ queryKey: ["overview"] }),
  );
  useSocket("crypto:price-update", () =>
    queryClient.invalidateQueries({ queryKey: ["overview"] }),
  );

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock className="grid gap-4 lg:grid-cols-4">
          <StatCard
            title="NGN market cap"
            value={currency(data?.marketCap ?? 0)}
            hint="Cached and refreshed from backend collectors"
          />
          <StatCard
            title="NGX ASI"
            value={compactNumber(data?.ngxAsi?.value ?? 0)}
            change={data?.ngxAsi?.percentChange ?? 0}
          />
          <StatCard
            title="Advancers vs decliners"
            value={`${data?.marketBreadth?.advancers ?? 0} / ${data?.marketBreadth?.decliners ?? 0}`}
            hint="Daily market breadth"
          />
          <StatCard
            title="Fear & greed"
            value={`${data?.fearGreed ?? 50}/100`}
            hint="Placeholder sentiment gauge for MVP"
          />
        </AnimatedBlock>

        <AnimatedBlock>
          <InstantSearch
            externalQuery={searchQuery}
            onQueryChange={setSearchQuery}
          />
        </AnimatedBlock>

        <AnimatedBlock className="grid gap-6 xl:grid-cols-2">
          <AssetTable
            title="Trending Nigerian stocks"
            items={data?.trendingStocks ?? []}
            type="stocks"
          />
          <AssetTable
            title="Trending crypto"
            items={data?.trendingCrypto ?? []}
            type="crypto"
          />
          <AssetTable
            title="Top gainers"
            items={data?.topGainers ?? []}
            type="stocks"
          />
          <AssetTable
            title="Top losers"
            items={data?.topLosers ?? []}
            type="stocks"
          />
        </AnimatedBlock>

        <AnimatedBlock>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Knowledge and research hub</h2>
              <p className="text-sm text-slate-400">
                New frontend surfaces for learn, research, categories, and
                newsletter
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {hubLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <AnimatedCard className="h-full">
                      <Card className="h-full space-y-4">
                        <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-brand">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </Card>
                    </AnimatedCard>
                  </Link>
                );
              })}
            </div>
          </section>
        </AnimatedBlock>

        <AnimatedBlock>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Market news</h2>
              <p className="text-sm text-slate-400">
                Every card is tappable and mobile-first
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {(data?.marketNews ?? []).map((item: any) => (
                <AnimatedCard key={item.id} className="h-full">
                  <NewsCard item={item} />
                </AnimatedCard>
              ))}
            </div>
          </section>
        </AnimatedBlock>

        <AnimatedBlock>
          <NewsletterForm compact />
        </AnimatedBlock>
      </AnimatedPage>
    </AppShell>
  );
}
