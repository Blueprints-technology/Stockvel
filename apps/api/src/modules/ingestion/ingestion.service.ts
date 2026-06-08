import { Injectable, Logger } from "@nestjs/common";
import { Prisma, AssetType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CoinGeckoProvider } from "./providers/coingecko.provider";
import { NewsProvider } from "./providers/news.provider";
import { NgxStockProvider } from "./providers/ngx-stock.provider";

function toFinite(value: unknown, fallback = 0): number {
  const n = Number(value);
  return isFinite(n) ? n : fallback;
}

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ngxStockProvider: NgxStockProvider,
    private readonly coinGeckoProvider: CoinGeckoProvider,
    private readonly newsProvider: NewsProvider,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async syncStocks() {
    const jobRun = await this.prisma.jobRun.create({
      data: { jobName: "stocks-sync", status: "running" },
    });

    try {
      const quotes = await this.ngxStockProvider.fetchStocks();
      let advancers = 0;
      let decliners = 0;
      let marketCap = 0;

      for (const quote of quotes) {
        const currentPrice = toFinite(quote.currentPrice);
        const dailyChange = toFinite(quote.dailyChange);
        const percentChange = toFinite(quote.percentChange);
        const volume = toFinite(quote.volume);
        const quoteMarketCap = toFinite(quote.marketCap);

        if (percentChange > 0) advancers += 1;
        if (percentChange < 0) decliners += 1;
        marketCap += quoteMarketCap;

        const stock = await this.prisma.stock.upsert({
          where: { ticker: quote.ticker },
          update: {
            companyName: quote.companyName,
            currentPrice,
            dailyChange,
            percentChange,
            volume,
            lastUpdatedAt: new Date(),
          },
          create: {
            ticker: quote.ticker,
            companyName: quote.companyName,
            sector: quote.sector ?? "Unclassified",
            currentPrice,
            dailyChange,
            percentChange,
            volume,
            marketCap: quoteMarketCap || null,
            lastUpdatedAt: new Date(),
          },
        });

        const tradeDate = quote.tradeDate ?? new Date();
        const open = currentPrice - dailyChange;
        const low = Math.max(currentPrice - Math.abs(dailyChange), 0);

        await this.prisma.stockPrice.upsert({
          where: { stockId_date: { stockId: stock.id, date: tradeDate } },
          update: {
            open,
            high: currentPrice,
            low,
            close: currentPrice,
            volume,
          },
          create: {
            stockId: stock.id,
            date: tradeDate,
            open,
            high: currentPrice,
            low,
            close: currentPrice,
            volume,
          },
        });
      }

      const totalPrice = quotes.reduce(
        (sum, q) => sum + toFinite(q.currentPrice),
        0,
      );
      const totalChange = quotes.reduce(
        (sum, q) => sum + toFinite(q.dailyChange),
        0,
      );
      const avgPctChange = Number(
        (
          quotes.reduce((sum, q) => sum + toFinite(q.percentChange), 0) /
          Math.max(quotes.length, 1)
        ).toFixed(2),
      );

      await this.prisma.marketIndex.upsert({
        where: { symbol: "NGXASI" },
        update: {
          name: "NGX All-Share Index",
          value: totalPrice,
          change: totalChange,
          percentChange: avgPctChange,
          marketCap,
          breadthAdvancers: advancers,
          breadthDecliners: decliners,
          tradeDate: new Date(),
          fearGreed: advancers >= decliners ? 58 : 42,
        },
        create: {
          symbol: "NGXASI",
          name: "NGX All-Share Index",
          value: totalPrice,
          change: totalChange,
          percentChange: avgPctChange,
          marketCap,
          breadthAdvancers: advancers,
          breadthDecliners: decliners,
          fearGreed: advancers >= decliners ? 58 : 42,
          tradeDate: new Date(),
        },
      });

      await this.prisma.jobRun.update({
        where: { id: jobRun.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          metadataJson: { count: quotes.length },
        },
      });
      this.realtimeGateway.broadcastPriceUpdate("stock", {
        count: quotes.length,
        updatedAt: new Date().toISOString(),
      });
      return { count: quotes.length };
    } catch (error) {
      await this.prisma.jobRun.update({
        where: { id: jobRun.id },
        data: {
          status: "failed",
          completedAt: new Date(),
          message: String(error),
        },
      });
      this.logger.error("Stock sync failed", error as Error);
      throw error;
    }
  }

  async syncCrypto() {
    const jobRun = await this.prisma.jobRun.create({
      data: { jobName: "crypto-sync", status: "running" },
    });

    try {
      const { global, trending, markets } =
        await this.coinGeckoProvider.fetchMarkets();
      const trendingSymbols = new Map<string, number>();
      trending.forEach((entry: any, index: number) => {
        trendingSymbols.set(
          entry.item?.symbol?.toUpperCase?.() ?? "",
          100 - index,
        );
      });

      for (const market of markets) {
        const symbol = String(market.symbol).toUpperCase();

        // ✅ Sanitize crypto numeric fields too
        const currentPrice = toFinite(market.current_price);
        const marketCapVal = toFinite(market.market_cap);
        const change24h = toFinite(market.price_change_percentage_24h);
        const volume24h = toFinite(market.total_volume);
        const circulatingSupply = toFinite(market.circulating_supply);
        const high24h = toFinite(market.high_24h, currentPrice);
        const low24h = toFinite(market.low_24h, currentPrice);

        const asset = await this.prisma.cryptoAsset.upsert({
          where: { symbol },
          update: {
            name: market.name,
            coingeckoId: market.id,
            currentPrice,
            marketCap: marketCapVal,
            change24h,
            volume24h,
            circulatingSupply,
            imageUrl: market.image,
            trendScore: trendingSymbols.get(symbol) ?? 50,
            lastUpdatedAt: new Date(),
          },
          create: {
            symbol,
            name: market.name,
            coingeckoId: market.id,
            currentPrice,
            marketCap: marketCapVal,
            change24h,
            volume24h,
            circulatingSupply,
            imageUrl: market.image,
            trendScore: trendingSymbols.get(symbol) ?? 50,
            lastUpdatedAt: new Date(),
          },
        });

        const today = new Date();
        await this.prisma.cryptoPrice.upsert({
          where: {
            cryptoAssetId_date: { cryptoAssetId: asset.id, date: today },
          },
          update: {
            open: currentPrice,
            high: high24h,
            low: low24h,
            close: currentPrice,
            volume: volume24h,
          },
          create: {
            cryptoAssetId: asset.id,
            date: today,
            open: currentPrice,
            high: high24h,
            low: low24h,
            close: currentPrice,
            volume: volume24h,
          },
        });
      }

      await this.prisma.jobRun.update({
        where: { id: jobRun.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          metadataJson: {
            globalMarketCap: global?.total_market_cap?.usd ?? 0,
            count: markets.length,
          },
        },
      });
      this.realtimeGateway.broadcastPriceUpdate("crypto", {
        count: markets.length,
        updatedAt: new Date().toISOString(),
      });
      return { count: markets.length, global };
    } catch (error) {
      await this.prisma.jobRun.update({
        where: { id: jobRun.id },
        data: {
          status: "failed",
          completedAt: new Date(),
          message: String(error),
        },
      });
      this.logger.error("Crypto sync failed", error as Error);
      throw error;
    }
  }

  async syncNews() {
    const jobRun = await this.prisma.jobRun.create({
      data: { jobName: "news-sync", status: "running" },
    });

    try {
      const items = await this.newsProvider.fetchNews();
      const categoryMap = await this.prisma.category.findMany();

      for (const item of items) {
        const category = categoryMap.find((entry) =>
          item.categories
            .map((value) => value.toLowerCase())
            .includes(entry.slug.toLowerCase()),
        );

        const categoryId = category?.id;
        const slug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 90);

        await this.prisma.news.upsert({
          where: { sourceUrl: item.sourceUrl },
          update: {
            title: item.title,
            slug,
            excerpt: item.excerpt,
            content: item.content,
            source: item.source,
            categoryId,
            publishedAt: item.publishedAt,
            isInsight: item.categories.some((value) =>
              value.toLowerCase().includes("analysis"),
            ),
            assetType: item.categories.some((value) =>
              value.toLowerCase().includes("crypto"),
            )
              ? AssetType.CRYPTO
              : undefined,
          },
          create: {
            title: item.title,
            slug,
            excerpt: item.excerpt,
            content: item.content,
            source: item.source,
            sourceUrl: item.sourceUrl,
            categoryId,
            publishedAt: item.publishedAt,
            isInsight: item.categories.some((value) =>
              value.toLowerCase().includes("analysis"),
            ),
          },
        });
      }

      await this.prisma.jobRun.update({
        where: { id: jobRun.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          metadataJson: { count: items.length },
        },
      });
      return { count: items.length };
    } catch (error) {
      await this.prisma.jobRun.update({
        where: { id: jobRun.id },
        data: {
          status: "failed",
          completedAt: new Date(),
          message: String(error),
        },
      });
      this.logger.error("News sync failed", error as Error);
      throw error;
    }
  }
}
