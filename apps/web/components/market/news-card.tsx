import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
// Adjust this import path to wherever you saved the animation components
import { AnimatedCard } from "@/components/ui/animated-page";

export function NewsCard({ item }: { item: any }) {
  return (
    <AnimatedCard className="h-full">
      <Link href={`/news/${item.slug}`} className="block h-full">
        <Card className="h-full">
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
              {item.category?.name ?? item.source}
            </div>
            <div>
              <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                {item.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{item.source}</span>
              <span>
                {formatDistanceToNow(new Date(item.publishedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </AnimatedCard>
  );
}
