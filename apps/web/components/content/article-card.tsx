"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import type { LearningArticle } from "@/types";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ article }: { article: LearningArticle }) {
  return (
    <AnimatedCard className="h-full">
      <Link href={`/learn/${article.slug}`} className="block h-full">
        <Card className="h-full space-y-4 border border-slate-200/70 bg-white/90 transition-colors duration-300 hover:border-slate-300 hover:bg-white">
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
              {article.category?.name ?? "Learning"}
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {article.title}
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              {article.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>{article.author}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" /> {article.readTime} min read
            </span>
          </div>

          {article.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </Card>
      </Link>
    </AnimatedCard>
  );
}
