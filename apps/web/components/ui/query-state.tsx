import { Card } from "./card";

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  skeletonRows?: number;
}

export function QueryState({
  isLoading,
  isError,
  errorMessage = "Something went wrong while loading this section.",
  onRetry,
  skeletonRows = 3,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <Card className="space-y-4 animate-pulse">
        <div className="h-4 w-40 rounded bg-slate-200" />
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="h-2.5 w-24 rounded bg-slate-100" />
            </div>
            <div className="h-3 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex items-center justify-between gap-4 border-danger-subtle bg-danger-subtle">
        <p className="text-sm text-danger-emphasis">{errorMessage}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 rounded-sm border border-danger/30 px-3 py-1.5 text-xs font-semibold text-danger-emphasis transition hover:bg-danger-subtle"
          >
            Retry
          </button>
        )}
      </Card>
    );
  }

  return null;
}
