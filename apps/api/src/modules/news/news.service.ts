import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryNewsDto } from './dto/query-news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  list(query: QueryNewsDto) {
    const where: Prisma.NewsWhereInput = {
      AND: [
        query.category ? { category: { slug: query.category } } : {},
        query.source ? { sourceRef: { slug: query.source } } : {},
        query.q
          ? {
              OR: [
                { title: { contains: query.q, mode: 'insensitive' } },
                { excerpt: { contains: query.q, mode: 'insensitive' } },
                { content: { contains: query.q, mode: 'insensitive' } },
              ],
            }
          : {},
        typeof query.insight === 'string' ? { isInsight: query.insight === 'true' } : {},
      ],
    };

    return this.prisma.news.findMany({
      where,
      include: { category: true, sourceRef: true },
      orderBy: [{ trendingScore: 'desc' }, { publishedAt: 'desc' }],
      take: 20,
    });
  }

  sources() {
    return this.prisma.newsSource.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async detail(slug: string) {
    const news = await this.prisma.news.findUnique({
      where: { slug },
      include: { category: true, sourceRef: true },
    });

    if (!news) {
      throw new NotFoundException('News article not found');
    }

    const related = await this.prisma.news.findMany({
      where: {
        id: { not: news.id },
        OR: [
          news.categoryId ? { categoryId: news.categoryId } : {},
          news.assetSymbol ? { assetSymbol: news.assetSymbol } : {},
        ],
      },
      take: 4,
      include: { category: true, sourceRef: true },
      orderBy: [{ trendingScore: 'desc' }, { publishedAt: 'desc' }],
    });

    return { ...news, related };
  }

  create(data: Record<string, unknown>) {
    return this.prisma.news.create({
      data: {
        title: String(data.title ?? ''),
        slug: String(data.slug ?? ''),
        excerpt: String(data.excerpt ?? ''),
        content: String(data.content ?? ''),
        source: String(data.source ?? ''),
        sourceUrl: String(data.sourceUrl ?? ''),
        externalUrl: typeof data.externalUrl === 'string' ? data.externalUrl : undefined,
        author: typeof data.author === 'string' ? data.author : undefined,
        imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
        categoryId: typeof data.categoryId === 'string' ? data.categoryId : undefined,
        sourceId: typeof data.sourceId === 'string' ? data.sourceId : undefined,
        assetType: data.assetType as Prisma.NewsCreateInput['assetType'],
        assetSymbol: typeof data.assetSymbol === 'string' ? data.assetSymbol : undefined,
        isInsight: Boolean(data.isInsight),
        trendingScore: Number(data.trendingScore ?? 60),
        publishedAt: data.publishedAt ? new Date(String(data.publishedAt)) : new Date(),
      },
    });
  }

  update(id: string, data: Record<string, unknown>) {
    return this.prisma.news.update({
      where: { id },
      data: {
        title: typeof data.title === 'string' ? data.title : undefined,
        slug: typeof data.slug === 'string' ? data.slug : undefined,
        excerpt: typeof data.excerpt === 'string' ? data.excerpt : undefined,
        content: typeof data.content === 'string' ? data.content : undefined,
        source: typeof data.source === 'string' ? data.source : undefined,
        sourceUrl: typeof data.sourceUrl === 'string' ? data.sourceUrl : undefined,
        externalUrl: typeof data.externalUrl === 'string' ? data.externalUrl : undefined,
        author: typeof data.author === 'string' ? data.author : undefined,
        imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
        categoryId: typeof data.categoryId === 'string' ? data.categoryId : undefined,
        sourceId: typeof data.sourceId === 'string' ? data.sourceId : undefined,
        assetType: data.assetType as Prisma.NewsUpdateInput['assetType'],
        assetSymbol: typeof data.assetSymbol === 'string' ? data.assetSymbol : undefined,
        isInsight: typeof data.isInsight === 'boolean' ? data.isInsight : undefined,
        trendingScore: data.trendingScore ? Number(data.trendingScore) : undefined,
      },
    });
  }
}
