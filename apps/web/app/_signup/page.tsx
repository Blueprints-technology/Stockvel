"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-page";
import { signup } from "@/services/auth";
import { authStore } from "@/store/auth-store";

const schema = z.object({
  displayName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignupPage() {
  const router = useRouter();
  const setSession = authStore((state) => state.setSession);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <AnimatedCard>
          <Card>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Start tracking Nigerian equities, crypto markets, and your own
              portfolio decisions.
            </p>
            <form
              className="mt-6 grid gap-4"
              onSubmit={form.handleSubmit(async (values) => {
                const session = await signup(values);
                setSession(session);
                router.push("/home");
              })}
            >
              <input
                {...form.register("displayName")}
                placeholder="Display name"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
              />
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
                Sign up
              </button>
            </form>
            <p className="mt-4 text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand">
                Login
              </Link>
            </p>
          </Card>
        </AnimatedCard>
      </div>
    </AppShell>
  );
}
