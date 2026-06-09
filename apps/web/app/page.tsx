"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Coins,
  LibraryBig,
  Mail,
  MessageSquare,
  Wallet,
} from "lucide-react";

const features = [
  {
    title: "Nigerian market clarity",
    description:
      "Track NGX breadth, top movers, and sector leaders with a polished mobile-first overview.",
    icon: LibraryBig,
  },
  {
    title: "Crypto market tracking",
    description:
      "Monitor global crypto trends, asset detail pages, and responsive charts from one interface.",
    icon: Coins,
  },
  {
    title: "Learn and research hub",
    description:
      "Read explainers, explore research reports, and listen to podcast briefings without leaving the app.",
    icon: BookOpen,
  },
  {
    title: "Portfolio and community",
    description:
      "Watch mixed allocations, follow your watchlist, and discuss asset ideas with other investors.",
    icon: Wallet,
  },
  {
    title: "Newsletter workflow",
    description:
      "Subscribe to weekly market wraps and use admin tools to draft or send campaigns.",
    icon: Mail,
  },
  {
    title: "Conversation and context",
    description:
      "Stay on top of insight articles, news, and community commentary around each asset.",
    icon: MessageSquare,
  },
];

const TICKERS = [
  ["ACCESSCORP", "25.30", "+2.1%", true],
  ["GTCO", "62.50", "+1.8%", true],
  ["ZENITHBANK", "49.80", "+0.6%", true],
  ["MTNN", "245.00", "+2.3%", true],
  ["DANGSUGAR", "35.40", "-1.7%", false],
  ["BUAFOODS", "967", "+0.0%", true],
  ["BTC", "$103,500", "+2.8%", true],
  ["ETH", "$3,800", "+4.1%", true],
  ["SOL", "$182", "+5.4%", true],
  ["USDT", "$1.00", "+0.0%", true],
  ["SEPLAT", "5800", "+2.1%", true],
  ["ARADEL", "1836", "+0.0%", true],
] as const;

function MarketCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0,
      H = 0,
      rafId = 0;

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      label: string;
      change: string;
      up: boolean;
      alpha: number;
      phase: number;
      speed: number;
    };

    let nodes: Node[] = [];

    function resize() {
      if (!canvas) return;

      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    function makeNode(): Node {
      const t = TICKERS[Math.floor(Math.random() * TICKERS.length)];
      return {
        x: Math.random() * W,
        y: Math.random() * (H - 40),
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        r: 18 + Math.random() * 12,
        label: t[0] as string,
        change: t[2] as string,
        up: t[3] as boolean,
        alpha: 0.05 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012,
      };
    }

    function init() {
      resize();
      nodes = Array.from({ length: 22 }, makeNode);
    }

    function drawLine(a: Node, b: Node, dist: number, maxDist: number) {
      const alpha = (1 - dist / maxDist) * 0.07;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(0, 122, 255, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function drawNode(n: Node, t: number) {
      const pulse = 1 + Math.sin(t * n.speed + n.phase) * 0.12;
      const r = n.r * pulse;

      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = n.up
        ? `rgba(22,163,74,${n.alpha * 0.35})`
        : `rgba(220,38,38,${n.alpha * 0.35})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.up
        ? `rgba(220,252,231,${n.alpha + 0.55})`
        : `rgba(254,226,226,${n.alpha + 0.55})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = n.up
        ? `rgba(22,163,74,${n.alpha + 0.3})`
        : `rgba(220,38,38,${n.alpha + 0.3})`;
      ctx.lineWidth = 0.75;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "500 9px Inter, system-ui, sans-serif";
      ctx.fillStyle = n.up ? "#166534" : "#991b1b";
      ctx.fillText(n.label, n.x, n.y - 3);
      ctx.font = "400 8px Inter, system-ui, sans-serif";
      ctx.fillStyle = n.up ? "#15803d" : "#b91c1c";
      ctx.fillText(n.change, n.x, n.y + 7);
    }

    let tick = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      tick++;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -40) n.x = W + 40;
        if (n.x > W + 40) n.x = -40;
        if (n.y < -40) n.y = H + 40;
        if (n.y > H + 40) n.y = -40;
      }

      const MAX_DIST = 130;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) drawLine(nodes[i], nodes[j], dist, MAX_DIST);
        }
      }

      for (const n of nodes) drawNode(n, tick);
      rafId = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(() => resize());
    observer.observe(canvas.parentElement!);

    init();

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!prefersReduced) draw();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function LandingPage() {
  return (
    <main className="page-shell space-y-10 py-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#f0f4ff] px-6 py-16 sm:px-10">
        <MarketCanvas />

        {/* Live ticker bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex h-9 items-center overflow-hidden border-t border-white/60 bg-white/50 backdrop-blur-sm">
          <div className="ticker-scroll flex animate-[ticker_28s_linear_infinite] items-center whitespace-nowrap hover:[animation-play-state:paused]">
            {[...TICKERS, ...TICKERS].map(([sym, price, change, up], i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 border-r border-black/[0.07] px-5 text-xs font-medium text-slate-800"
              >
                <span className="font-bold text-slate-900">{sym}</span>
                {price}
                <span className={up ? "text-green-600" : "text-red-600"}>
                  {change}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid gap-10 pb-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex animate-[fadeUp_0.5s_ease_both] items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-brand">
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              Modern Nigerian financial intelligence
            </span>
            <div className="space-y-4 animate-[fadeUp_0.6s_ease_both_0.15s]">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                A premium, African-first market platform for stocks, crypto,
                learning, and research.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Stockvel combines market monitoring, portfolio tools,
                educational content, research reports, podcast briefings, and
                newsletter distribution inside one product built for Nigerian
                investors.
              </p>
            </div>
            <div className="flex animate-[fadeUp_0.6s_ease_both_0.3s] flex-wrap gap-3">
              <Link
                href="/home"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-fintech transition hover:-translate-y-px hover:bg-brand-hover"
              >
                Explore market overview
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-px hover:bg-white"
              >
                Open learn hub
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-px hover:bg-white"
              >
                Open research desk
              </Link>
            </div>
          </div>

          <div className="grid animate-[fadeUp_0.7s_ease_both_0.25s] gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-fintech backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-elevated"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-slate-900 p-3 text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
