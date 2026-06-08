"use client";

import Link from "next/link";
import { Headphones, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import type { PodcastEpisode } from "@/types";
import { formatDate, formatDuration } from "@/lib/utils";

export function PodcastCard({ episode }: { episode: PodcastEpisode }) {
  return (
    <AnimatedCard>
      <Link href={`/research/podcasts/${episode.slug}`}>
        <Card className="h-full space-y-4 border border-slate-200/70 bg-white/90 hover:border-slate-300 hover:bg-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Headphones className="size-3.5" /> Podcast episode
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {episode.title}
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              {episode.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>
              S{episode.seasonNumber}E{episode.episodeNumber}
            </span>
            <span>•</span>
            <span>{formatDuration(episode.duration)}</span>
            <span>•</span>
            <span>{formatDate(episode.publishedAt)}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
            <PlayCircle className="size-4" /> Listen now
          </div>
        </Card>
      </Link>
    </AnimatedCard>
  );
}
