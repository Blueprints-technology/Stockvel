"use client";

import {
  CandlestickChart,
  Maximize2,
  Minimize2,
  Moon,
  PenTool,
  SunMedium,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ChartTimeframe = "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";
export type ChartTypeOption = "candlestick" | "heikin-ashi";
export type IndicatorOption = "RSI" | "MACD";
export type DrawingToolOption =
  | "cursor"
  | "trendline"
  | "rectangle"
  | "fibonacci"
  | "text";
export type ChartThemeMode = "light" | "dark";

export interface ChartToolbarProps {
  timeframe: ChartTimeframe;
  chartType: ChartTypeOption;
  indicators: IndicatorOption[];
  activeDrawingTool: DrawingToolOption;
  theme: ChartThemeMode;
  isFullscreen?: boolean;
  onTimeframeChange: (value: ChartTimeframe) => void;
  onChartTypeChange: (value: ChartTypeOption) => void;
  onIndicatorsChange: (value: IndicatorOption[]) => void;
  onDrawingToolChange: (value: DrawingToolOption) => void;
  onThemeChange: (value: ChartThemeMode) => void;
  onFullscreenToggle?: () => void;
  className?: string;
}

const timeframeOptions: ChartTimeframe[] = [
  "1W",
  "1M",
  "3M",
  "6M",
  "1Y",
  "ALL",
];
const chartTypeOptions: Array<{ value: ChartTypeOption; label: string }> = [
  { value: "candlestick", label: "Candles" },
  { value: "heikin-ashi", label: "Heikin-Ashi" },
];
const indicatorOptions: IndicatorOption[] = ["RSI", "MACD"];
const drawingTools: Array<{ value: DrawingToolOption; label: string }> = [
  { value: "cursor", label: "Cursor" },
  { value: "trendline", label: "Trendline" },
  { value: "rectangle", label: "Rectangle" },
  { value: "fibonacci", label: "Fib" },
  { value: "text", label: "Text" },
];

export function ChartToolbar({
  timeframe,
  chartType,
  indicators,
  activeDrawingTool,
  theme,
  isFullscreen = false,
  onTimeframeChange,
  onChartTypeChange,
  onIndicatorsChange,
  onDrawingToolChange,
  onThemeChange,
  onFullscreenToggle,
  className,
}: ChartToolbarProps) {
  const toggleIndicator = (indicator: IndicatorOption) => {
    if (indicators.includes(indicator)) {
      onIndicatorsChange(indicators.filter((item) => item !== indicator));
      return;
    }

    onIndicatorsChange([...indicators, indicator]);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-fintech backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/75",
        className,
      )}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {timeframeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onTimeframeChange(option)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                timeframe === option
                  ? "bg-brand text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {onFullscreenToggle ? (
            <button
              type="button"
              onClick={onFullscreenToggle}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              {isFullscreen ? "Exit full" : "Fullscreen"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
            {chartTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChartTypeChange(option.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  chartType === option.value
                    ? "bg-white text-brand shadow-sm dark:bg-slate-900"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
                )}
              >
                <CandlestickChart className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {indicatorOptions.map((option) => {
              const active = indicators.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleIndicator(option)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    active
                      ? "border-brand/40 bg-brand/10 text-brand dark:border-brand/60 dark:bg-brand/15"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <PenTool className="h-4 w-4" />
            Drawing tools
          </span>
          {drawingTools.map((tool) => (
            <button
              key={tool.value}
              type="button"
              onClick={() => onDrawingToolChange(tool.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                activeDrawingTool === tool.value
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
              )}
            >
              {tool.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
