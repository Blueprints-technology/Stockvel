// @/components/market/instant-search.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Loader2,
  AlertCircle,
  TrendingUp,
  Coins,
  Newspaper,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchEverything } from "@/services/market";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { Card } from "@/components/ui/card";
import Link from "next/link";

// ✅ Accept optional controlled props
interface InstantSearchProps {
  externalQuery?: string;
  onQueryChange?: (value: string) => void;
}

const SECTIONS = [
  { key: "stocks", label: "Stocks", icon: TrendingUp },
  { key: "crypto", label: "Crypto", icon: Coins },
  { key: "news", label: "News", icon: Newspaper },
] as const;

export function InstantSearch({
  externalQuery,
  onQueryChange,
}: InstantSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Use external query if provided, else manage internally
  const [internalQuery, setInternalQuery] = useState(
    () => searchParams.get("q") ?? "",
  );

  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = (value: string) => {
    if (onQueryChange) {
      onQueryChange(value); // ✅ Controlled mode
    } else {
      setInternalQuery(value); // ✅ Uncontrolled mode
      // Sync to URL when uncontrolled
      if (value.trim()) {
        router.replace(`/search?q=${encodeURIComponent(value)}`, {
          scroll: false,
        });
      } else {
        router.replace(`/`, { scroll: false });
      }
    }
  };

  const debounced = useDebouncedValue(query, 250);
  const { addItem, items } = useRecentSearches();

  const { data, isFetching, isError, isLoading } = useQuery({
    queryKey: ["global-search", debounced],
    queryFn: () => searchEverything(debounced),
    enabled: debounced.length >= 2,
  });

  const hasResults =
    data &&
    ((data.stocks?.length ?? 0) > 0 ||
      (data.crypto?.length ?? 0) > 0 ||
      (data.news?.length ?? 0) > 0);

  const showResultsGrid = debounced.length >= 2 && !isLoading;

  return (
    <Card className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm outline-none ring-brand/20 transition focus:ring"
          placeholder="Search stocks, crypto, news..."
          aria-label="Search stocks, crypto, and news"
        />
        {isFetching && debounced.length >= 2 && (
          <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {items.length > 0 && debounced.length < 2 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Recent:</span>
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {debounced.length < 2 ? (
        <p className="text-sm text-slate-400">
          {items.length > 0
            ? "Select a recent search or start typing to find assets."
            : "Start typing to search across stocks, crypto, and news."}
        </p>
      ) : isError ? (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          <AlertCircle className="size-4 shrink-0" />
          <span>Something went wrong while searching. Please try again.</span>
        </div>
      ) : !hasResults && !isFetching ? (
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium text-slate-600">
            No results found for &quot;{debounced}&quot;
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search terms or check for typos.
          </p>
        </div>
      ) : showResultsGrid ? (
        <div className="grid gap-3 md:grid-cols-3">
          {SECTIONS.map(({ key, label, icon: Icon }) => {
            const sectionData = (data as any)?.[key] ?? [];
            const hasSectionData = sectionData.length > 0;

            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="size-3.5 text-slate-400" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {label}
                  </p>
                  {hasSectionData && (
                    <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 shadow-sm">
                      {sectionData.length}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {sectionData.slice(0, 4).map((item: any) => {
                    const href =
                      key === "stocks"
                        ? `/stocks/${item.ticker}`
                        : key === "crypto"
                          ? `/crypto/${item.symbol}`
                          : `/news/${item.slug}`;

                    const title = item.title ?? item.companyName ?? item.name;
                    const subtitle =
                      key === "stocks"
                        ? item.sector
                        : key === "crypto"
                          ? item.symbol
                          : item.source;

                    return (
                      <Link
                        key={item.id ?? item.slug ?? item.symbol}
                        href={href}
                        onClick={() => {
                          addItem(query);
                          // Optional: clear query after selection
                          // setQuery("");
                        }}
                        className="group flex flex-col rounded-xl bg-white px-3 py-2 text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-brand hover:shadow-md"
                      >
                        <span className="truncate font-medium">{title}</span>
                        {subtitle && (
                          <span className="truncate text-xs text-slate-400 group-hover:text-brand/70">
                            {subtitle}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  {!hasSectionData && isFetching && (
                    <div className="space-y-2">
                      <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
                      <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
                    </div>
                  )}

                  {!hasSectionData && !isFetching && (
                    <p className="py-2 text-center text-xs text-slate-400 italic">
                      No {label.toLowerCase()} found.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-3 h-3 w-16 animate-pulse rounded bg-slate-200" />
              <div className="space-y-2">
                <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-12 animate-pulse rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
