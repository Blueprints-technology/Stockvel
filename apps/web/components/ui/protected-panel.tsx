'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import { Card } from './card';
import { authStore } from '@/store/auth-store';

export function ProtectedPanel({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const user = authStore((state) => state.user);

  if (!user) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <LockKeyhole className="mx-auto mb-4 size-10 text-brand" />
        <h2 className="text-2xl font-semibold text-slate-950">Sign in required</h2>
        <p className="mt-2 text-sm text-slate-500">Login to access personalized features like portfolio tracking, watchlists, and community tools.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/login" className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white">Login</Link>
          <Link href="/signup" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Create account</Link>
        </div>
      </Card>
    );
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <LockKeyhole className="mx-auto mb-4 size-10 text-brand" />
        <h2 className="text-2xl font-semibold text-slate-950">Admin access only</h2>
        <p className="mt-2 text-sm text-slate-500">This area is limited to platform operators with elevated privileges.</p>
      </Card>
    );
  }

  return <>{children}</>;
}
