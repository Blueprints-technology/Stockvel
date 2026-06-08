"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bell, BookOpen, LibraryBig, Mail, ShieldCheck } from "lucide-react";
import { NewsletterForm } from "@/components/content/newsletter-form";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import { ProtectedPanel } from "@/components/ui/protected-panel";
import { QueryState } from "@/components/ui/query-state";
import { getMe } from "@/services/auth";
import { authStore } from "@/store/auth-store";

export default function ProfilePage() {
  const user = authStore((state) => state.user);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: 1,
    enabled: Boolean(user),
  });

  return (
    <AppShell>
      <ProtectedPanel>
        <QueryState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Unable to load your profile right now."
        />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <AnimatedCard>
            <Card className="space-y-4">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-brand text-2xl font-semibold text-white">
                {data?.profile?.displayName?.[0] ?? "U"}
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {data?.profile?.displayName ?? "Your profile"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  @{data?.profile?.username ?? "market_user"}
                </p>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-brand" />{" "}
                  {data?.email ?? "Sign in to view email"}
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-4 text-brand" /> Role:{" "}
                  {data?.role ?? "USER"}
                </div>
              </div>
              <div className="grid gap-3">
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <BookOpen className="size-4 text-brand" /> Continue learning
                </Link>
                <Link
                  href="/research"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <LibraryBig className="size-4 text-brand" /> Open research
                  desk
                </Link>
              </div>
            </Card>
          </AnimatedCard>
          <div className="space-y-6">
            <AnimatedCard>
              <Card>
                <div className="flex items-center gap-3">
                  <Bell className="size-5 text-brand" />
                  <h2 className="section-title">Notifications</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {(data?.notifications ?? []).map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedCard>
            <NewsletterForm compact />
          </div>
        </div>
      </ProtectedPanel>
    </AppShell>
  );
}
