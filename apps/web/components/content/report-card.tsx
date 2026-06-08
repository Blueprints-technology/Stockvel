"use client";

import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import type { ResearchReport } from "@/types";
import { formatDate } from "@/lib/utils";

export function ReportCard({ report }: { report: ResearchReport }) {
  return (
    <AnimatedCard>
      <Link href={`/research/reports/${report.slug}`}>
        <Card className="h-full space-y-4 border border-slate-200/70 bg-white/90 hover:border-slate-300 hover:bg-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <FileText className="size-3.5" />
            {report.type.replaceAll("_", " ")}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {report.title}
            </h3>
            <p className="text-sm leading-6 text-slate-500">{report.summary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>{report.author}</span>
            <span>•</span>
            <span>{formatDate(report.reportDate)}</span>
            <span>•</span>
            <span>{report.reportYear}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              {report.isPremium ? "Premium report" : "Open access"}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
              <Download className="size-4" /> {report.downloadCount}
            </span>
          </div>
        </Card>
      </Link>
    </AnimatedCard>
  );
}
