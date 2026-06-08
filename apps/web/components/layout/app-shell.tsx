"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Coins,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  Mail,
  Newspaper,
  Search,
  Shapes,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Overview", icon: LayoutDashboard },
  { href: "/stocks", label: "Stocks", icon: Activity },
  { href: "/crypto", label: "Crypto", icon: Coins },
  { href: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/research", label: "Research", icon: LibraryBig },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/categories", label: "Themes", icon: Shapes },
  { href: "/newsletter", label: "Newsletter", icon: Mail },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/home?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks, crypto, news…"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none ring-brand/20 transition focus:bg-white focus:ring"
      />
    </form>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="page-shell flex items-center justify-between gap-4 py-4">
          <Link
            href="/home"
            className="flex items-center gap-3 text-slate-900 shrink-0"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-brand text-white shadow-fintech">
              SV
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand">
                Stockvel
              </p>
              <p className="text-sm text-slate-500">
                Invest clearly | Track confidently
              </p>
            </div>
          </Link>

          <div className="flex-1 flex justify-end">
            <GlobalSearch />
          </div>
        </div>
      </header>

      <nav className="sticky top-20 z-30 border-b border-slate-200 bg-white/95 backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent">
        <div className="page-shell">
          <div className="flex gap-2 overflow-x-auto py-3 md:flex-wrap md:justify-center md:overflow-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium transition md:flex-row md:px-3 md:text-sm whitespace-nowrap shrink-0",
                    active
                      ? "bg-brand text-white shadow-fintech"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="page-shell flex-1">{children}</main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="page-shell py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-xl bg-brand text-white text-xs font-bold">
                SV
              </div>
              <p className="text-sm text-slate-500">
                Nigerian stocks · Crypto · Learn · Research · Newsletter
                intelligence
              </p>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Stockvel.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
