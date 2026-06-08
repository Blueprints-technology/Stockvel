import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getPagination } from '../../common/utils/paginate.util';
import { QueryArticlesDto } from './dto/query-articles.dto';

@Injectable()
export class LearnService {
  constructor(private readonly prisma: PrismaService) {}

  async listArticles(query: QueryArticlesDto, userId?: string) {
    const { page, limit, skip } = getPagination(query);
    const where: Prisma.ArticleWhereInput = {
      status: ArticleStatus.PUBLISHED,
      AND: [
        query.category ? { category: { slug: query.category } } : {},
        query.q
          ? {
              OR: [
                { title: { contains: query.q, mode: 'insensitive' } },
                { excerpt: { contains: query.q, mode: 'insensitive' } },
                { tags: { has: query.q.toLowerCase() } },
              ],
            }
          : {},
      ],
    };

    const [items, total, categories, trending, featured] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
        include: {
          category: true,
          bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
        },
      }),
      this.prisma.article.count({ where }),
      this.prisma.articleCategory.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.article.findMany({
        where: { status: ArticleStatus.PUBLISHED },
        take: 5,
        orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
        include: { category: true },
      }),
      this.prisma.article.findFirst({
        where: { status: ArticleStatus.PUBLISHED, isFeatured: true },
        orderBy: [{ publishedAt: 'desc' }],
        include: { category: true },
      }),
    ]);

    return {
      items: items.map((article) => ({
        ...article,
        isBookmarked: Array.isArray(article.bookmarks) ? article.bookmarks.length > 0 : false,
      })),
      featured,
      trending,
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  categories() {
    return this.prisma.articleCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });
  }

  async featured() {
    return this.prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED, isFeatured: true },
      orderBy: [{ publishedAt: 'desc' }],
      take: 4,
      include: { category: true },
    });
  }

  async articleBySlug(slug: string, userId?: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    if (!article || article.status !== ArticleStatus.PUBLISHED) {
      throw new NotFoundException('Article not found');
    }

    await this.prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    const related = await this.related(slug);

    return {
      ...article,
      viewCount: article.viewCount + 1,
      isBookmarked: Array.isArray(article.bookmarks) ? article.bookmarks.length > 0 : false,
      related,
    };
  }

  async related(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return this.prisma.article.findMany({
      where: {
        id: { not: article.id },
        status: ArticleStatus.PUBLISHED,
        OR: [
          article.categoryId ? { categoryId: article.categoryId } : {},
          article.tags.length > 0 ? { tags: { hasSome: article.tags } } : {},
        ],
      },
      take: 4,
      orderBy: [{ publishedAt: 'desc' }],
      include: { category: true },
    });
  }

  async toggleBookmark(slug: string, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article || article.status !== ArticleStatus.PUBLISHED) {
      throw new NotFoundException('Article not found');
    }

    const existing = await this.prisma.articleBookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: article.id,
        },
      },
    });

    if (existing) {
      await this.prisma.articleBookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }

    await this.prisma.articleBookmark.create({
      data: {
        userId,
        articleId: article.id,
      },
    });

    return { bookmarked: true };
  }
}
