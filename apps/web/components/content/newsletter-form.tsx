"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import { subscribeNewsletter, unsubscribeNewsletter } from "@/services/market";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState("learn,research,markets");
  const [mode, setMode] = useState<"subscribe" | "unsubscribe">("subscribe");
  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "subscribe") {
        return subscribeNewsletter({
          email,
          preferences: topics
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        });
      }
      return unsubscribeNewsletter({ email });
    },
  });

  return (
    <AnimatedCard>
      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-3 text-brand">
            <Mail className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              Stay on the weekly market list
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Get new learning articles, research notes, podcasts, and curated
              market highlights in your inbox.
            </p>
          </div>
        </div>
        <div
          className={`grid gap-3 ${compact ? "md:grid-cols-[1fr_auto]" : ""}`}
        >
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-brand/20 transition focus:ring"
          />
          {!compact ? (
            <input
              value={topics}
              onChange={(event) => setTopics(event.target.value)}
              placeholder="learn,research,markets"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-brand/20 transition focus:ring"
            />
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("subscribe");
                mutation.mutate();
              }}
              disabled={!email || mutation.isPending}
              className="rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending && mode === "subscribe"
                ? "Saving…"
                : "Subscribe"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("unsubscribe");
                mutation.mutate();
              }}
              disabled={!email || mutation.isPending}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending && mode === "unsubscribe"
                ? "Updating…"
                : "Unsubscribe"}
            </button>
          </div>
        </div>
        {compact ? (
          <p className="text-xs text-slate-400">
            Topics default to learn, research, and market updates.
          </p>
        ) : null}
        {mutation.data?.message ? (
          <p className="text-sm text-emerald-600">{mutation.data.message}</p>
        ) : null}
        {mutation.isError ? (
          <p className="text-sm text-rose-600">
            Unable to update newsletter preferences right now.
          </p>
        ) : null}
      </Card>
    </AnimatedCard>
  );
}
