'use client';

import { createChart, ColorType } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export function PriceChart({
  data,
  positive = true,
}: {
  data: Array<{ date: string; close: number }>;
  positive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#FFFFFF' },
        textColor: '#64748b',
      },
      autoSize: true,
      grid: {
        vertLines: { color: '#F1F5F9' },
        horzLines: { color: '#F1F5F9' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
      crosshair: { mode: 0 },
    });

    const series = chart.addAreaSeries({
      lineColor: positive ? '#16C784' : '#EA3943',
      topColor: positive ? 'rgba(22, 199, 132, 0.25)' : 'rgba(234, 57, 67, 0.25)',
      bottomColor: 'rgba(0,0,0,0)',
    });

    series.setData(
      data.map((point) => ({
        time: point.date.split('T')[0] as any,
        value: point.close,
      })),
    );

    return () => chart.remove();
  }, [data, positive]);

  return <div ref={containerRef} className="h-64 w-full" />;
}
