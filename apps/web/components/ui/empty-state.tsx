import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="border border-dashed border-slate-200 bg-slate-50/70 text-center">
      <div className="mx-auto mb-4 inline-flex rounded-2xl bg-white p-3 text-brand shadow-sm">
        <Icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Card>
  );
}
