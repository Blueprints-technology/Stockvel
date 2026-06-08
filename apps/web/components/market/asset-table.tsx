import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import { compactNumber, currency, percentage } from "@/lib/utils";
import type { Stock, CryptoAsset } from "@/types";

type AssetItem = Stock | CryptoAsset;

function isStock(item: AssetItem): item is Stock {
  return "ticker" in item;
}

interface AssetTableProps {
  title: string;
  items: AssetItem[];
  type: "stocks" | "crypto";
  isLoading?: boolean;
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-16 rounded bg-slate-200" />
        <div className="h-2.5 w-24 rounded bg-slate-100" />
      </div>
      <div className="h-3 w-20 rounded bg-slate-200" />
      <div className="h-5 w-16 rounded bg-slate-100" />
      <div className="h-3 w-16 rounded bg-slate-200" />
    </div>
  );
}

export function AssetTable({
  title,
  items,
  type,
  isLoading = false,
}: AssetTableProps) {
  return (
    <Card className="p-0 md:overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h3 className="section-title">{title}</h3>
        <p className="text-xs text-muted-subtle">Tap a row for details</p>
      </div>

      {isLoading && (
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-muted">
          No data available right now.
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <>
          {/* ─── Desktop View (Unchanged for WebSocket performance) ─── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Asset
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 font-medium tabular-nums"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 font-medium tabular-nums"
                  >
                    Change
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 font-medium tabular-nums"
                  >
                    Mkt Cap
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const change = isStock(item)
                    ? item.percentChange
                    : item.change24h;
                  const href = isStock(item)
                    ? `/stocks/${item.ticker}`
                    : `/crypto/${item.symbol}`;
                  const symbol = isStock(item) ? item.ticker : item.symbol;
                  const name = isStock(item) ? item.companyName : item.name;
                  const curr = isStock(item) ? "NGN" : "USD";

                  return (
                    <tr key={item.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link href={href} className="block">
                          <p className="font-semibold text-slate-900">
                            {symbol}
                          </p>
                          <p className="text-xs text-muted">{name}</p>
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-mono tabular-nums text-slate-900">
                        <Link href={href} className="block">
                          {currency(item.currentPrice, curr)}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <Link href={href} className="block">
                          <span
                            className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold ${change >= 0 ? "bg-success-subtle text-success-emphasis" : "bg-danger-subtle text-danger-emphasis"}`}
                          >
                            {change >= 0 ? (
                              <ArrowUpRight className="size-3" aria-hidden />
                            ) : (
                              <ArrowDownRight className="size-3" aria-hidden />
                            )}
                            {percentage(change)}
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-4 font-mono tabular-nums text-muted">
                        <Link href={href} className="block">
                          {compactNumber(item.marketCap ?? 0)}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ─── Mobile View (Upgraded with AnimatedCard) ─── */}
          <div className="md:hidden space-y-2 p-3">
            {items.map((item) => {
              const change = isStock(item)
                ? item.percentChange
                : item.change24h;
              const href = isStock(item)
                ? `/stocks/${item.ticker}`
                : `/crypto/${item.symbol}`;
              const symbol = isStock(item) ? item.ticker : item.symbol;
              const name = isStock(item) ? item.companyName : item.name;
              const curr = isStock(item) ? "NGN" : "USD";

              return (
                <AnimatedCard
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-100"
                >
                  <Link
                    href={href}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{symbol}</p>
                      <p className="truncate text-xs text-muted">{name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono tabular-nums text-sm text-slate-900">
                        {currency(item.currentPrice, curr)}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold ${change >= 0 ? "bg-success-subtle text-success-emphasis" : "bg-danger-subtle text-danger-emphasis"}`}
                      >
                        {change >= 0 ? (
                          <ArrowUpRight className="size-3" aria-hidden />
                        ) : (
                          <ArrowDownRight className="size-3" aria-hidden />
                        )}
                        {percentage(change)}
                      </span>
                    </div>
                  </Link>
                </AnimatedCard>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}
