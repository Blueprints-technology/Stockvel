import { Card } from '@/components/ui/card';
import { compactNumber, currency } from '@/lib/utils';

export function PortfolioAllocation({ assets }: { assets: any[] }) {
  const total = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Allocation</h3>
        <span className="text-sm text-slate-400">{assets.length} assets</span>
      </div>
      <div className="space-y-3">
        {assets.map((asset) => (
          <div key={asset.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-900">{asset.assetSymbol}</span>
              <span className="text-slate-500">{currency(asset.currentValue, asset.assetType === 'STOCK' ? 'NGN' : 'USD')}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand" style={{ width: `${total ? (asset.currentValue / total) * 100 : 0}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{asset.allocationPct}%</span>
              <span>{compactNumber(asset.quantity)} units</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
