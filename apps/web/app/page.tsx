import Link from 'next/link';
import { ArrowRight, BookOpen, Coins, LibraryBig, Mail, MessageSquare, Wallet } from 'lucide-react';

const features = [
  { title: 'Nigerian market clarity', description: 'Track NGX breadth, top movers, and sector leaders with a polished mobile-first overview.', icon: LibraryBig },
  { title: 'Crypto market tracking', description: 'Monitor global crypto trends, asset detail pages, and responsive charts from one interface.', icon: Coins },
  { title: 'Learn and research hub', description: 'Read explainers, explore research reports, and listen to podcast briefings without leaving the app.', icon: BookOpen },
  { title: 'Portfolio and community', description: 'Watch mixed allocations, follow your watchlist, and discuss asset ideas with other investors.', icon: Wallet },
  { title: 'Newsletter workflow', description: 'Subscribe to weekly market wraps and use admin tools to draft or send campaigns.', icon: Mail },
  { title: 'Conversation and context', description: 'Stay on top of insight articles, news, and community commentary around each asset.', icon: MessageSquare },
];

export default function LandingPage() {
  return (
    <main className="page-shell space-y-10 py-8">
      <section className="glass-panel overflow-hidden bg-hero-radial px-6 py-16 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-brand">Modern Nigerian financial intelligence</span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                A premium, African-first market platform for stocks, crypto, learning, and research.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                MarketPulse NG combines market monitoring, portfolio tools, educational content, research reports, podcast briefings, and newsletter distribution inside one product built for Nigerian investors.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/home" className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-fintech">
                Explore market overview
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/learn" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                Open learn hub
              </Link>
              <Link href="/research" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                Open research desk
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-fintech">
                  <div className="mb-4 inline-flex rounded-2xl bg-slate-900 p-3 text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
