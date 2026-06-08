import { Injectable } from '@nestjs/common';
import { ArticleStatus, ResearchReportStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const q = query.trim();
    if (!q) {
      return { stocks: [], crypto: [], news: [], articles: [], research: [] };
    }

    const [stocks, crypto, news, articles, research] = await Promise.all([
      this.prisma.stock.findMany({
        where: {
          OR: [
            { ticker: { contains: q.toUpperCase(), mode: 'insensitive' } },
            { companyName: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 8,
        orderBy: { trendScore: 'desc' },
      }),
      this.prisma.cryptoAsset.findMany({
        where: {
          OR: [
            { symbol: { contains: q.toUpperCase(), mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 8,
        orderBy: { trendScore: 'desc' },
      }),
      this.prisma.news.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 8,
        orderBy: [{ trendingScore: 'desc' }, { publishedAt: 'desc' }],
      }),
      this.prisma.article.findMany({
        where: {
          status: ArticleStatus.PUBLISHED,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { tags: { has: q.toLowerCase() } },
          ],
        },
        take: 6,
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
        include: { category: true },
      }),
      this.prisma.researchReport.findMany({
        where: {
          status: ResearchReportStatus.PUBLISHED,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
            { tags: { has: q.toLowerCase() } },
          ],
        },
        take: 6,
        orderBy: { reportDate: 'desc' },
      }),
    ]);

    return { stocks, crypto, news, articles, research };
  }
}
