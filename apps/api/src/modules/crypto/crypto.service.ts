import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getPagination } from '../../common/utils/paginate.util';
import { QueryCryptoDto } from './dto/query-crypto.dto';

@Injectable()
export class CryptoService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: QueryCryptoDto) {
    const { limit, skip, page } = getPagination(query);
    const where: Prisma.CryptoAssetWhereInput = {
      AND: [
        query.category ? { assetCategories: { some: { category: { slug: query.category } } } } : {},
        query.q
          ? {
              OR: [
                { symbol: { contains: query.q.toUpperCase(), mode: 'insensitive' } },
                { name: { contains: query.q, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };

    const [items, total, categories] = await Promise.all([
      this.prisma.cryptoAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ marketCap: 'desc' }, { trendScore: 'desc' }],
        include: { assetCategories: { include: { category: true } } },
      }),
      this.prisma.cryptoAsset.count({ where }),
      this.prisma.sectorCategory.findMany({ orderBy: { name: 'asc' } }),
    ]);

    return {
      items,
      categories: categories.map((item) => item.slug),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async detail(symbol: string) {
    const asset = await this.prisma.cryptoAsset.findUnique({
      where: { symbol: symbol.toUpperCase() },
      include: {
        prices: {
          orderBy: { date: 'asc' },
          take: 365,
        },
        assetCategories: { include: { category: true } },
      },
    });

    if (!asset) {
      throw new NotFoundException('Crypto asset not found');
    }

    const [comments, relatedNews] = await Promise.all([
      this.prisma.comment.findMany({
        where: { assetType: 'CRYPTO', assetSymbol: asset.symbol, isModerated: false },
        include: {
          user: { include: { profile: true } },
          replies: {
            where: { isModerated: false },
            include: { user: { include: { profile: true } } },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }],
        take: 20,
      }),
      this.prisma.news.findMany({
        where: {
          OR: [{ assetType: 'CRYPTO', assetSymbol: asset.symbol }, { category: { slug: 'crypto' } }],
        },
        include: { sourceRef: true },
        orderBy: [{ trendingScore: 'desc' }, { publishedAt: 'desc' }],
        take: 6,
      }),
    ]);

    return {
      ...asset,
      comments,
      relatedNews,
    };
  }

  async global() {
    const [count, marketCap, volume24h] = await Promise.all([
      this.prisma.cryptoAsset.count(),
      this.prisma.cryptoAsset.aggregate({ _sum: { marketCap: true } }),
      this.prisma.cryptoAsset.aggregate({ _sum: { volume24h: true } }),
    ]);

    return {
      activeAssets: count,
      totalMarketCap: marketCap._sum.marketCap ?? 0,
      totalVolume24h: volume24h._sum.volume24h ?? 0,
    };
  }

  trending() {
    return this.prisma.cryptoAsset.findMany({
      take: 10,
      orderBy: [{ trendScore: 'desc' }, { volume24h: 'desc' }],
    });
  }
}
