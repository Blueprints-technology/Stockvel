"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import { ProtectedPanel } from "@/components/ui/protected-panel";
import { QueryState } from "@/components/ui/query-state";
import { currency } from "@/lib/utils";
import { api } from "@/services/api";
import { authStore } from "@/store/auth-store";

export default function WatchlistPage() {
  const queryClient = useQueryClient();
  const user = authStore((state) => state.user);
  const form = useForm({
    defaultValues: { assetType: "STOCK", assetSymbol: "" },
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => (await api.get("/watchlist")).data,
    retry: 1,
    enabled: Boolean(user),
  });
  const addMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/watchlist", payload),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  return (
    <AppShell>
      <ProtectedPanel>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Unable to load your watchlist right now."
        />
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <AnimatedCard>
            <Card>
              <h1 className="section-title">Add watchlist item</h1>
              <form
                className="mt-5 grid gap-4"
                onSubmit={form.handleSubmit((values) =>
                  addMutation.mutate({
                    ...values,
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
                <button
                  className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white"
                  type="submit"
                >
                  Add to watchlist
                </button>
              </form>
            </Card>
          </AnimatedCard>
          <AnimatedCard>
            <Card>
              <h2 className="section-title">Saved assets</h2>
              <div className="mt-4 space-y-3">
                {(data?.items ?? []).map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.asset?.ticker ??
                          item.asset?.symbol ??
                          item.assetSymbol}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.asset?.companyName ??
                          item.asset?.name ??
                          "Saved asset"}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {currency(
                        item.asset?.currentPrice ?? 0,
                        item.assetType === "STOCK" ? "NGN" : "USD",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedCard>
        </div>
      </ProtectedPanel>
    </AppShell>
  );
}
