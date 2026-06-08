"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import { currency } from "@/lib/utils";

export default function TaxPage() {
  const form = useForm({
    defaultValues: { buyPrice: 0, sellPrice: 0, quantity: 0 },
  });
  const values = form.watch();

  const results = useMemo(() => {
    const buy = Number(values.buyPrice);
    const sell = Number(values.sellPrice);
    const quantity = Number(values.quantity);
    const cost = buy * quantity;
    const proceeds = sell * quantity;
    const profit = proceeds - cost;
    const estimatedTax = profit > 0 ? profit * 0.1 : 0;
    const roi = cost ? (profit / cost) * 100 : 0;
    return { cost, proceeds, profit, estimatedTax, roi };
  }, [values]);

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <AnimatedCard>
          <Card>
            <h1 className="section-title">Tax insights calculator</h1>
            <form className="mt-5 grid gap-4">
              <input
                type="number"
                step="0.01"
                {...form.register("buyPrice")}
                placeholder="Buy price"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <input
                type="number"
                step="0.01"
                {...form.register("sellPrice")}
                placeholder="Sell price"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <input
                type="number"
                step="0.0000001"
                {...form.register("quantity")}
                placeholder="Quantity"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
            </form>
          </Card>
        </AnimatedCard>
        <AnimatedCard>
          <Card className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Estimated profit/loss</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {currency(results.profit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Estimated tax</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {currency(results.estimatedTax)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">ROI percentage</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {results.roi.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Gross proceeds</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {currency(results.proceeds)}
              </p>
            </div>
          </Card>
        </AnimatedCard>
      </div>
    </AppShell>
  );
}
