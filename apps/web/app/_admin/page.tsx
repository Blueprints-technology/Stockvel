"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { ProtectedPanel } from "@/components/ui/protected-panel";
import { QueryState } from "@/components/ui/query-state";
import { AnimatedCard } from "@/components/ui/animated-page";
import { api } from "@/services/api";
import {
  draftNewsletter,
  fetchNewsletterSubscribers,
  sendNewsletter,
} from "@/services/market";
import { authStore } from "@/store/auth-store";
import { formatDate } from "@/lib/utils";

export default function AdminPage() {
  const user = authStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("Weekly Market Wrap");
  const [content, setContent] = useState(
    "A concise weekly round-up of NGX, crypto, learning, and research highlights.",
  );
  const [scheduledFor, setScheduledFor] = useState("");

  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => (await api.get("/admin/overview")).data,
    retry: 1,
    enabled: isAdmin,
  });
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/admin/users")).data,
    retry: 1,
    enabled: isAdmin,
  });
  const subscribersQuery = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: fetchNewsletterSubscribers,
    retry: 1,
    enabled: isAdmin,
  });

  const draftMutation = useMutation({
    mutationFn: async () =>
      draftNewsletter({
        subject,
        content,
        scheduledFor: scheduledFor || undefined,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] }),
  });

  const sendMutation = useMutation({
    mutationFn: async () => sendNewsletter({ subject, content }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] }),
  });

  return (
    <AppShell>
      <ProtectedPanel requireAdmin>
        <QueryState
          isLoading={overviewQuery.isLoading}
          isError={overviewQuery.isError}
          errorMessage="Unable to load admin analytics right now."
        />
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
              Admin dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Moderation, ingestion jobs, newsletter operations, and analytics
              overview
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {Object.entries(overviewQuery.data?.metrics ?? {}).map(
              ([key, value]) => (
                <AnimatedCard key={key}>
                  <Card className="space-y-2">
                    <p className="text-sm capitalize text-slate-500">{key}</p>
                    <p className="text-2xl font-semibold text-slate-950">
                      {String(value)}
                    </p>
                  </Card>
                </AnimatedCard>
              ),
            )}
            <AnimatedCard>
              <Card className="space-y-2">
                <p className="text-sm capitalize text-slate-500">Subscribers</p>
                <p className="text-2xl font-semibold text-slate-950">
                  {subscribersQuery.data?.length ?? 0}
                </p>
              </Card>
            </AnimatedCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <AnimatedCard>
              <Card>
                <h2 className="section-title">Recent job runs</h2>
                <div className="mt-4 space-y-3">
                  {(overviewQuery.data?.jobs ?? []).map((job: any) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          {job.jobName}
                        </span>
                        <span className="text-slate-500">{job.status}</span>
                      </div>
                      <p className="mt-1 text-slate-400">
                        {job.message ?? "Completed normally"}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedCard>

            <AnimatedCard>
              <Card>
                <h2 className="section-title">Users</h2>
                <div className="mt-4 space-y-3">
                  {(usersQuery.data ?? []).map((account: any) => (
                    <div
                      key={account.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          {account.profile?.displayName ?? account.email}
                        </span>
                        <span className="text-slate-500">{account.role}</span>
                      </div>
                      <p className="mt-1 text-slate-400">{account.email}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <AnimatedCard>
              <Card className="space-y-4">
                <div>
                  <h2 className="section-title">Newsletter composer</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Draft or send campaigns tied to the newly implemented
                    newsletter backend.
                  </p>
                </div>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-brand/20 transition focus:ring"
                  placeholder="Subject"
                />
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-brand/20 transition focus:ring"
                  placeholder="Newsletter content"
                />
                <input
                  value={scheduledFor}
                  onChange={(event) => setScheduledFor(event.target.value)}
                  type="datetime-local"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-brand/20 transition focus:ring"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => draftMutation.mutate()}
                    className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    {draftMutation.isPending ? "Saving…" : "Save draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => sendMutation.mutate()}
                    className="rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    {sendMutation.isPending ? "Sending…" : "Send newsletter"}
                  </button>
                </div>
                {draftMutation.data?.status ? (
                  <p className="text-sm text-emerald-600">
                    Draft saved with status {draftMutation.data.status}.
                  </p>
                ) : null}
                {sendMutation.data?.status ? (
                  <p className="text-sm text-emerald-600">
                    Newsletter sent with status {sendMutation.data.status}.
                  </p>
                ) : null}
              </Card>
            </AnimatedCard>

            <AnimatedCard>
              <Card>
                <h2 className="section-title">Subscribers</h2>
                <div className="mt-4 space-y-3">
                  {(subscribersQuery.data ?? []).map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-900">
                          {subscriber.email}
                        </span>
                        <span
                          className={
                            subscriber.isActive
                              ? "text-xs font-semibold text-success"
                              : "text-xs font-semibold text-slate-400"
                          }
                        >
                          {subscriber.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-400">
                        Subscribed {formatDate(subscriber.subscribedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </ProtectedPanel>
    </AppShell>
  );
}
