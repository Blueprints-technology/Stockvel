import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "./card";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-page";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  hint?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  hint,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="space-y-3 animate-pulse">
        <div className="h-3 w-28 rounded bg-slate-200" />
        <div className="h-6 w-36 rounded bg-slate-200" />
        <div className="h-5 w-20 rounded bg-slate-100" />
      </Card>
    );
  }

  const positive = (change ?? 0) >= 0;

  return (
    <Card className="space-y-3">
      <p className="text-sm text-muted">{title}</p>
      <div className="space-y-2">
        <p className="text-headline text-slate-900">
          <AnimatedNumber value={value} />
        </p>

        {typeof change === "number" && (
          <div
            aria-label={`${positive ? "Up" : "Down"} ${Math.abs(change).toFixed(2)}%`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-semibold",
              positive
                ? "bg-success-subtle text-success-emphasis"
                : "bg-danger-subtle text-danger-emphasis",
            )}
          >
            {positive ? (
              <TrendingUp className="size-3.5" aria-hidden />
            ) : (
              <TrendingDown className="size-3.5" aria-hidden />
            )}
            <span>
              {positive ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
      {hint && <p className="text-xs text-muted-subtle">{hint}</p>}
    </Card>
  );
}
