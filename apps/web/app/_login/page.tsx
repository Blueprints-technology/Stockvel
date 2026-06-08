"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import { login } from "@/services/auth";
import { authStore } from "@/store/auth-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginPage() {
  const router = useRouter();
  const setSession = authStore((state) => state.setSession);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "demo@fmp.com", password: "Password123!" },
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <AnimatedCard>
          <Card>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to manage portfolios, watchlists, and community
              conversations.
            </p>
            <form
              className="mt-6 grid gap-4"
              onSubmit={form.handleSubmit(async (values) => {
                const session = await login(values);
                setSession(session);
                router.push("/home");
              })}
            >
              <input
                {...form.register("email")}
                placeholder="Email"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <input
                {...form.register("password")}
                type="password"
                placeholder="Password"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
              <button
                className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white"
                type="submit"
              >
                Login
              </button>
            </form>
            <p className="mt-4 text-sm text-slate-500">
              Need an account?{" "}
              <Link href="/signup" className="font-semibold text-brand">
                Create one
              </Link>
            </p>
          </Card>
        </AnimatedCard>
      </div>
    </AppShell>
  );
}
