"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Layers3, TrendingUp } from "lucide-react";
import { NewsletterForm } from "@/components/content/newsletter-form";
import { AppShell } from "@/components/layout/app-shell";
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
import { currency, percentage } from "@/lib/utils";
import { fetchSectorCategories } from "@/services/market";

export default function CategoriesPage() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sector-categories"],
    queryFn: fetchSectorCategories,
  });

  return (
    <AppShell>
      <AnimatedPage>
        <AnimatedBlock>
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-radial px-6 py-8 shadow-fintech sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
                  Themes
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Explore sector themes and cross-asset market leadership
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  The categories hub turns the new backend sector mapping into a
                  frontend browsing surface, helping investors jump from themes
                  into the strongest matching stocks and crypto assets.
                </p>
              </div>

              <AnimatedSlide
                from="right"
                className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
              >
                <Card className="bg-white/85">
                  <p className="text-sm text-slate-500">Themes</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    <AnimatedNumber value={String(data.length)} />
                  </p>
                </Card>
                <Card className="bg-white/85">
                  <p className="text-sm text-slate-500">Mapped assets</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    <AnimatedNumber
                      value={String(
                        data.reduce(
                          (sum, item) => sum + (item.assetCount ?? 0),
                          0,
                        ),
                      )}
                    />
                  </p>
                </Card>
                <Card className="bg-white/85">
                  <p className="text-sm text-slate-500">Use case</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    Sector-first discovery
                  </p>
                </Card>
              </AnimatedSlide>
            </div>
          </div>
        </AnimatedBlock>

        <AnimatedBlock>
          <QueryState
            isLoading={isLoading}
            isError={isError}
            errorMessage="Unable to load sector categories right now."
          />
        </AnimatedBlock>

        <AnimatedBlock>
          {(data ?? []).length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <AnimatedCard className="group h-full">
                    <Card className="h-full space-y-4 border border-slate-200/70 bg-white/90 transition-colors duration-300 hover:border-slate-300 hover:bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-brand transition group-hover:scale-105">
                          <Layers3 className="size-5" />
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          <AnimatedNumber
                            value={String(category.assetCount ?? 0)}
                          />{" "}
                          assets
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-slate-950">
                          {category.name}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {category.description ??
                            "Browse the strongest mapped opportunities inside this market theme."}
                        </p>
                      </div>

                      {category.topMover ? (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Top mover
                              </p>
                              <p className="mt-1 font-semibold text-slate-900">
                                {category.topMover.ticker}
                              </p>
                              <p className="text-xs text-slate-500">
                                {category.topMover.companyName}
                              </p>
                            </div>
                            <TrendingUp className="size-5 text-success" />
                          </div>
                          <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-900">
                              <AnimatedNumber
                                value={currency(category.topMover.currentPrice)}
                              />
                            </span>
                            <span
                              className={
                                category.topMover.percentChange >= 0
                                  ? "font-semibold text-success"
                                  : "font-semibold text-danger"
                              }
                            >
                              <AnimatedNumber
                                value={percentage(
                                  category.topMover.percentChange,
                                )}
                              />
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-400">
                          No mapped top mover yet for this theme.
                        </div>
                      )}

                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                        Open theme{" "}
                        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                      </div>
                    </Card>
                  </AnimatedCard>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Layers3}
              title="No sector themes available"
              description="Theme cards will appear here after the category mapping data is populated."
            />
          )}
        </AnimatedBlock>

        <AnimatedBlock>
          <NewsletterForm compact />
        </AnimatedBlock>
      </AnimatedPage>
    </AppShell>
  );
}
