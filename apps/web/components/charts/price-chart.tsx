"use client";

import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { AnimatedBlock } from "@/components/ui/animated-page";
import { cn } from "@/lib/utils";

export function PriceChart({
  data,
  positive = true,
}: {
  data: Array<{ date: string; close: number }>;
  positive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  const [tooltip, setTooltip] = useState<{
    date: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#FFFFFF" },
        textColor: "#64748b",
      },
      autoSize: true,
      grid: {
        vertLines: { color: "#F1F5F9" },
        horzLines: { color: "#F1F5F9" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });

    chartRef.current = chart;

    const series = chart.addAreaSeries({
      lineColor: positive ? "#16C784" : "#EA3943",
      topColor: positive
        ? "rgba(22, 199, 132, 0.25)"
        : "rgba(234, 57, 67, 0.25)",
      bottomColor: "rgba(0,0,0,0)",
      lineWidth: 2,
    });

    seriesRef.current = series;

    const seen = new Set<string>();
    const cleaned = data
      .map((point) => ({
        time: point.date.split("T")[0] as any,
        value: point.close,
      }))
      .filter((point) => {
        if (seen.has(point.time)) return false;
        seen.add(point.time);
        return true;
      })
      .sort((a, b) => (a.time > b.time ? 1 : -1));

    if (cleaned.length > 0) {
      series.setData(cleaned);

      chart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.point) {
          setTooltip(null);
          return;
        }

        const rawPriceData = param.seriesData.get(series);

        if (
          rawPriceData &&
          "value" in rawPriceData &&
          typeof rawPriceData.value === "number"
        ) {
          const rawTime = param.time as string;
          const dateObj = new Date(rawTime);

          setTooltip({
            date: dateObj.toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            value: rawPriceData.value,
          });
        }
      });
    }

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [data, positive]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-400">
        No historical price data available
      </div>
    );
  }

  return (
    <AnimatedBlock className="relative">
      {tooltip && (
        <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-lg border border-slate-100 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
          <p className="text-xs text-slate-500">{tooltip.date}</p>
          <p
            className={cn(
              "text-lg font-semibold tabular-nums",
              positive ? "text-success" : "text-danger",
            )}
          >
            {tooltip.value.toFixed(2)}
          </p>
        </div>
      )}
      <div ref={containerRef} className="h-64 w-full" />
    </AnimatedBlock>
  );
}
