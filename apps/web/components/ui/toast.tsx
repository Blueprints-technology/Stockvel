"use client";

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useEffect,
} from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "danger" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms, default 4000
}

type Action = { type: "ADD"; toast: Toast } | { type: "REMOVE"; id: string };

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case "ADD":
      return [action.toast, ...state].slice(0, 5); // max 5
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

const ToastContext = createContext<{
  toast: (opts: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    dispatch({ type: "ADD", toast: { duration: 4000, ...opts, id } });
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Portal-style fixed container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 md:bottom-6 md:right-6"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Mount once in your root layout inside <Providers> */
export { ToastProvider as Toaster };

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toaster>");
  return ctx;
}

const icons: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  danger: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantCls: Record<ToastVariant, string> = {
  success: "border-success/20 bg-success-subtle text-success-emphasis",
  danger: "border-danger/20  bg-danger-subtle  text-danger-emphasis",
  warning: "border-warning/20 bg-warning-subtle text-warning-emphasis",
  info: "border-info/20    bg-info-subtle    text-info-emphasis",
};

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const variant = t.variant ?? "info";
  const Icon = icons[variant];

  useEffect(() => {
    const timer = setTimeout(onDismiss, t.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [t.duration, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        "flex w-80 items-start gap-3 rounded-md border p-4 shadow-card",
        variantCls[variant],
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="flex-1">
        <p className="text-sm font-semibold">{t.title}</p>
        {t.description && (
          <p className="mt-1 text-xs opacity-80">{t.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-sm opacity-60 hover:opacity-100 focus-visible:outline focus-visible:outline-2"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
