import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md border border-slate-200 bg-white p-5 shadow-card sm:p-6",
        className,
      )}
      {...props}
    />
  );
}
