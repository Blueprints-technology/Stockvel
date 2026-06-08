import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReorderWatchlistDto, WatchlistItemDto } from './dto/update-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWatchlist(userId: string) {
    const watchlist = await this.ensureWatchlist(userId);
    const items = await this.prisma.watchlistItem.findMany({
      where: { watchlistId: watchlist.id },
      orderBy: { position: 'asc' },
    });

    const stockSymbols = items.filter((item) => item.assetType === 'STOCK').map((item) => item.assetSymbol);
    const cryptoSymbols = items.filter((item) => item.assetType === 'CRYPTO').map((item) => item.assetSymbol);

    const [stocks, cryptos] = await Promise.all([
      this.prisma.stock.findMany({ where: { ticker: { in: stockSymbols } } }),
      this.prisma.cryptoAsset.findMany({ where: { symbol: { in: cryptoSymbols } } }),
    ]);

    return {
      ...watchlist,
      items: items.map((item) => ({
        ...item,
        asset:
          item.assetType === 'STOCK'
            ? stocks.find((stock) => stock.ticker === item.assetSymbol)
            : cryptos.find((crypto) => crypto.symbol === item.assetSymbol),
      })),
    };
  }

  async addItem(userId: string, dto: WatchlistItemDto) {
    const watchlist = await this.ensureWatchlist(userId);
    const count = await this.prisma.watchlistItem.count({ where: { watchlistId: watchlist.id } });
    return this.prisma.watchlistItem.upsert({
      where: {
        watchlistId_assetType_assetSymbol: {
          watchlistId: watchlist.id,
          assetType: dto.assetType,
          assetSymbol: dto.assetSymbol.toUpperCase(),
        },
      },
      update: {},
      create: {
        watchlistId: watchlist.id,
        assetType: dto.assetType,
        assetSymbol: dto.assetSymbol.toUpperCase(),
        position: dto.position ?? count,
      },
    });
  }

  async reorder(userId: string, dto: ReorderWatchlistDto) {
    const watchlist = await this.ensureWatchlist(userId);
    await this.prisma.$transaction(
      dto.items.map((item, index) =>
        this.prisma.watchlistItem.updateMany({
          where: {
            watchlistId: watchlist.id,
            assetType: item.assetType,
            assetSymbol: item.assetSymbol.toUpperCase(),
          },
          data: { position: item.position ?? index },
        }),
      ),
    );

    return this.getWatchlist(userId);
  }

  async removeItem(userId: string, dto: WatchlistItemDto) {
    const watchlist = await this.ensureWatchlist(userId);
    await this.prisma.watchlistItem.deleteMany({
      where: {
        watchlistId: watchlist.id,
        assetType: dto.assetType,
        assetSymbol: dto.assetSymbol.toUpperCase(),
      },
    });
    return { success: true };
  }

  private async ensureWatchlist(userId: string) {
    const existing = await this.prisma.watchlist.findFirst({ where: { userId } });
    if (existing) {
      return existing;
    }
    return this.prisma.watchlist.create({
      data: {
        userId,
        name: 'My Watchlist',
      },
    });
  }
}
