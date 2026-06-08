import { Injectable } from '@nestjs/common';
import { ArticleStatus, ResearchReportStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const [marketIndex, trendingStocks, gainers, losers, trendingCrypto, news, featuredArticles, latestResearch, sectorCategories] = await Promise.all([
      this.prisma.marketIndex.findFirst({
        where: { symbol: 'NGXASI' },
        orderBy: { tradeDate: 'desc' },
      }),
      this.prisma.stock.findMany({ take: 6, orderBy: [{ trendScore: 'desc' }, { volume: 'desc' }] }),
      this.prisma.stock.findMany({ take: 6, where: { percentChange: { gt: 0 } }, orderBy: { percentChange: 'desc' } }),
      this.prisma.stock.findMany({ take: 6, where: { percentChange: { lt: 0 } }, orderBy: { percentChange: 'asc' } }),
      this.prisma.cryptoAsset.findMany({ take: 6, orderBy: [{ trendScore: 'desc' }, { volume24h: 'desc' }] }),
      this.prisma.news.findMany({ take: 8, orderBy: [{ trendingScore: 'desc' }, { publishedAt: 'desc' }], include: { category: true, sourceRef: true } }),
      this.prisma.article.findMany({
        where: { status: ArticleStatus.PUBLISHED },
        take: 3,
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
        include: { category: true },
      }),
      this.prisma.researchReport.findMany({
        where: { status: ResearchReportStatus.PUBLISHED },
        take: 3,
        orderBy: { reportDate: 'desc' },
      }),
      this.prisma.sectorCategory.findMany({
        take: 6,
        orderBy: { name: 'asc' },
        include: { _count: { select: { assetMappings: true } } },
      }),
    ]);

    return {
      marketCap: marketIndex?.marketCap ?? 0,
      ngxAsi: marketIndex,
      marketBreadth: {
        advancers: marketIndex?.breadthAdvancers ?? 0,
        decliners: marketIndex?.breadthDecliners ?? 0,
      },
      fearGreed: marketIndex?.fearGreed ?? 50,
      trendingStocks,
      trendingCrypto,
      topGainers: gainers,
      topLosers: losers,
      marketNews: news,
      featuredArticles,
      latestResearch,
      sectorCategories: sectorCategories.map((category) => ({
        ...category,
        assetCount: category._count.assetMappings,
      })),
      categories: ['Stocks', 'Crypto', 'Learn', 'Research', 'Newsletter'],
      updatedAt: new Date().toISOString(),
    };
  }

  insights() {
    return this.prisma.news.findMany({
      where: { isInsight: true },
      include: { category: true, sourceRef: true },
      orderBy: [{ trendingScore: 'desc' }, { publishedAt: 'desc' }],
      take: 12,
    });
  }
}
