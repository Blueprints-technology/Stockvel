import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const [users, comments, jobs, news, stocks, crypto, newsletters, subscribers, providers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.comment.count(),
      this.prisma.jobRun.findMany({ orderBy: { startedAt: 'desc' }, take: 10 }),
      this.prisma.news.count(),
      this.prisma.stock.count(),
      this.prisma.cryptoAsset.count(),
      this.prisma.newsletter.count(),
      this.prisma.newsletterSubscriber.count(),
      this.prisma.stockDataProvider.count(),
    ]);

    return {
      metrics: { users, comments, jobs: jobs.length, news, stocks, crypto, newsletters, subscribers, providers },
      jobs,
    };
  }

  users() {
    return this.prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  comments(moderated?: string) {
    return this.prisma.comment.findMany({
      where: typeof moderated === 'string' ? { isModerated: moderated === 'true' } : {},
      include: { user: { include: { profile: true } }, replies: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  moderateComment(commentId: string, isModerated: boolean) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { isModerated },
    });
  }

  publishNews(body: Record<string, unknown>) {
    return this.prisma.news.create({
      data: {
        title: String(body.title ?? ''),
        slug: String(body.slug ?? ''),
        excerpt: String(body.excerpt ?? ''),
        content: String(body.content ?? ''),
        source: String(body.source ?? ''),
        sourceUrl: String(body.sourceUrl ?? ''),
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : undefined,
        categoryId: typeof body.categoryId === 'string' ? body.categoryId : undefined,
        sourceId: typeof body.sourceId === 'string' ? body.sourceId : undefined,
        assetType: body.assetType as never,
        assetSymbol: typeof body.assetSymbol === 'string' ? body.assetSymbol : undefined,
        isInsight: Boolean(body.isInsight),
        trendingScore: Number(body.trendingScore ?? 50),
        publishedAt: body.publishedAt ? new Date(String(body.publishedAt)) : new Date(),
      },
    });
  }

  newsletters() {
    return this.prisma.newsletter.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      take: 50,
    });
  }

  subscribers() {
    return this.prisma.newsletterSubscriber.findMany({
      orderBy: [{ isActive: 'desc' }, { subscribedAt: 'desc' }],
      take: 200,
    });
  }

  providerStatus() {
    return this.prisma.stockDataProvider.findMany({
      orderBy: [{ priority: 'asc' }, { name: 'asc' }],
      include: {
        statusLogs: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
