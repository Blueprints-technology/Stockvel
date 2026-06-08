"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AppShell } from "@/components/layout/app-shell";
import { PortfolioAllocation } from "@/components/portfolio/portfolio-allocation";
import { Card } from "@/components/ui/card";
import { ProtectedPanel } from "@/components/ui/protected-panel";
import { QueryState } from "@/components/ui/query-state";
import { AnimatedCard } from "@/components/ui/animated-page";
import { currency } from "@/lib/utils";
import { api } from "@/services/api";
import { authStore } from "@/store/auth-store";

export default function PortfolioPage() {
  const queryClient = useQueryClient();
  const user = authStore((state) => state.user);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => (await api.get("/portfolio")).data,
    retry: 1,
    enabled: Boolean(user),
  });
  const form = useForm({
    defaultValues: {
      assetType: "STOCK",
      assetSymbol: "",
      quantity: 0,
      buyPrice: 0,
      notes: "",
    },
  });
  const addMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/portfolio/add", payload),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  return (
    <AppShell>
      <ProtectedPanel>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Unable to load your portfolio right now."
        />
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <AnimatedCard>
              <Card className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">Total value</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {currency(data?.summary?.totalValue ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Unrealized P/L</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {currency(data?.summary?.unrealizedPnl ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Daily change</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {currency(data?.summary?.dailyChange ?? 0)}
                  </p>
                </div>
              </Card>
            </AnimatedCard>
            <PortfolioAllocation assets={data?.assets ?? []} />
          </div>

          <div className="space-y-6">
            <AnimatedCard>
              <Card>
                <h2 className="section-title">Add asset</h2>
                <form
                  className="mt-5 grid gap-4"
                  onSubmit={form.handleSubmit((values) =>
                    addMutation.mutate({
                      ...values,
                      quantity: Number(values.quantity),
                      buyPrice: Number(values.buyPrice),
                      assetSymbol: values.assetSymbol.toUpperCase(),
                    }),
                  )}
                >
                  <select
                    {...form.register("assetType")}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  >
                    <option value="STOCK">Stock</option>
                    <option value="CRYPTO">Crypto</option>
                  </select>
                  <input
                    {...form.register("assetSymbol")}
                    placeholder="Ticker or symbol"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  />
                  <input
                    type="number"
                    step="0.0000001"
                    {...form.register("quantity")}
                    placeholder="Quantity"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    {...form.register("buyPrice")}
                    placeholder="Buy price"
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  />
                  <textarea
                    {...form.register("notes")}
                    placeholder="Notes"
                    className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  />
                  <button
                    className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white"
                    type="submit"
                  >
                    Save asset
                  </button>
                </form>
              </Card>
            </AnimatedCard>
            <AnimatedCard>
              <Card>
                <h2 className="section-title">Asset list</h2>
                <div className="mt-4 space-y-3">
                  {(data?.assets ?? []).map((asset: any) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {asset.assetSymbol}
                        </p>
                        <p className="text-sm text-slate-500">
                          {asset.quantity} units • cost{" "}
                          {currency(
                            asset.costBasis,
                            asset.assetType === "STOCK" ? "NGN" : "USD",
                          )}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {currency(
                          asset.currentValue,
                          asset.assetType === "STOCK" ? "NGN" : "USD",
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </ProtectedPanel>
    </AppShell>
  );
}
