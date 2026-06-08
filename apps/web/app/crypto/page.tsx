"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { AssetTable } from "@/components/market/asset-table";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedBlock, AnimatedPage } from "@/components/ui/animated-page";
import { compactNumber, currency } from "@/lib/utils";
import { fetchCrypto } from "@/services/market";
import { api } from "@/services/api";

export default function CryptoPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["crypto"],
    queryFn: () => fetchCrypto(),
  });

  const { data: global, isLoading: isGlobalLoading } = useQuery({
    queryKey: ["crypto-global"],
    queryFn: async () => (await api.get("/crypto/global")).data,
  });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
              Crypto dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Global crypto market tracking
            </h1>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Active assets"
              value={compactNumber(global?.activeAssets ?? 0)}
              isLoading={isGlobalLoading}
            />
            <StatCard
              title="Total market cap"
              value={currency(global?.totalMarketCap ?? 0, "USD")}
              isLoading={isGlobalLoading}
            />
            <StatCard
              title="24h volume"
              value={currency(global?.totalVolume24h ?? 0, "USD")}
              isLoading={isGlobalLoading}
            />
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <AssetTable
            title="Crypto assets"
            items={data?.items ?? []}
            type="crypto"
            isLoading={isLoading}
          />
        </AnimatedBlock>
      </AnimatedPage>
    </AppShell>
  );
}
