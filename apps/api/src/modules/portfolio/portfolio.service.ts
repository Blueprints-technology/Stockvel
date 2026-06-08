import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertPortfolioAssetDto } from './dto/upsert-portfolio-asset.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async getPortfolio(userId: string) {
    const assets = await this.prisma.portfolioAsset.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const stockSymbols = assets.filter((item) => item.assetType === AssetType.STOCK).map((item) => item.assetSymbol);
    const cryptoSymbols = assets.filter((item) => item.assetType === AssetType.CRYPTO).map((item) => item.assetSymbol);

    const [stocks, cryptos] = await Promise.all([
      this.prisma.stock.findMany({ where: { ticker: { in: stockSymbols } } }),
      this.prisma.cryptoAsset.findMany({ where: { symbol: { in: cryptoSymbols } } }),
    ]);

    const priceMap = new Map<string, number>();
    const dailyChangeMap = new Map<string, number>();

    stocks.forEach((stock) => {
      priceMap.set(`STOCK:${stock.ticker}`, stock.currentPrice);
      dailyChangeMap.set(`STOCK:${stock.ticker}`, stock.percentChange);
    });
    cryptos.forEach((asset) => {
      priceMap.set(`CRYPTO:${asset.symbol}`, asset.currentPrice);
      dailyChangeMap.set(`CRYPTO:${asset.symbol}`, asset.change24h);
    });

    const enrichedAssets = assets.map((asset) => {
      const key = `${asset.assetType}:${asset.assetSymbol}`;
      const currentPrice = priceMap.get(key) ?? asset.buyPrice;
      const currentValue = asset.quantity * currentPrice;
      const costBasis = asset.quantity * asset.buyPrice;
      const pnl = currentValue - costBasis;
      const allocationBase = currentValue;
      return {
        ...asset,
        currentPrice,
        currentValue,
        costBasis,
        pnl,
        dailyChangePct: dailyChangeMap.get(key) ?? 0,
        allocationBase,
      };
    });

    const totalValue = enrichedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalCost = enrichedAssets.reduce((sum, asset) => sum + asset.costBasis, 0);
    const totalPnl = totalValue - totalCost;
    const dailyChange = enrichedAssets.reduce(
      (sum, asset) => sum + asset.currentValue * ((asset.dailyChangePct ?? 0) / 100),
      0,
    );

    return {
      assets: enrichedAssets.map((asset) => ({
        ...asset,
        allocationPct: totalValue ? Number(((asset.currentValue / totalValue) * 100).toFixed(2)) : 0,
      })),
      summary: {
        totalValue: Number(totalValue.toFixed(2)),
        totalCost: Number(totalCost.toFixed(2)),
        unrealizedPnl: Number(totalPnl.toFixed(2)),
        dailyChange: Number(dailyChange.toFixed(2)),
      },
    };
  }

  addAsset(userId: string, dto: UpsertPortfolioAssetDto) {
    return this.prisma.portfolioAsset.create({
      data: {
        userId,
        assetType: dto.assetType,
        assetSymbol: dto.assetSymbol.toUpperCase(),
        quantity: dto.quantity,
        buyPrice: dto.buyPrice,
        notes: dto.notes,
      },
    });
  }

  async removeAsset(userId: string, id: string) {
    const asset = await this.prisma.portfolioAsset.findFirst({
      where: { id, userId },
    });

    if (!asset) {
      throw new NotFoundException('Portfolio asset not found');
    }

    await this.prisma.portfolioAsset.delete({ where: { id } });
    return { success: true };
  }
}
