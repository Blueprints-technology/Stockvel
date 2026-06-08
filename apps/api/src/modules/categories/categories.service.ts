import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { getPagination } from '../../common/utils/paginate.util';
import { QueryCategoryAssetsDto } from './dto/query-category-assets.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const categories = await this.prisma.sectorCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { assetMappings: true },
        },
      },
    });

    const topMovers = await Promise.all(
      categories.map(async (category) => {
        const stock = await this.prisma.stock.findFirst({
          where: { assetCategories: { some: { categoryId: category.id } } },
          orderBy: [{ percentChange: 'desc' }, { trendScore: 'desc' }],
          select: {
            id: true,
            ticker: true,
            companyName: true,
            currentPrice: true,
            percentChange: true,
            dailyChange: true,
          },
        });

        return {
          ...category,
          assetCount: category._count.assetMappings,
          topMover: stock,
        };
      }),
    );

    return topMovers;
  }

  async detail(slug: string) {
    const category = await this.prisma.sectorCategory.findUnique({
      where: { slug },
      include: {
        assetMappings: {
          include: {
            stock: true,
            cryptoAsset: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Sector category not found');
    }

    const stocks = category.assetMappings
      .map((mapping) => mapping.stock)
      .filter((stock): stock is NonNullable<typeof stock> => Boolean(stock))
      .sort((a, b) => b.percentChange - a.percentChange);

    const crypto = category.assetMappings
      .map((mapping) => mapping.cryptoAsset)
      .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset))
      .sort((a, b) => b.change24h - a.change24h);

    return {
      ...category,
      stocks,
      crypto,
    };
  }

  async stocks(slug: string, query: QueryCategoryAssetsDto) {
    const category = await this.prisma.sectorCategory.findUnique({ where: { slug } });
    if (!category) {
      throw new NotFoundException('Sector category not found');
    }

    const { page, limit, skip } = getPagination(query);
    const where = { assetCategories: { some: { categoryId: category.id } } };
    const [items, total] = await Promise.all([
      this.prisma.stock.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ percentChange: 'desc' }, { trendScore: 'desc' }],
        include: {
          assetCategories: {
            include: { category: true },
          },
        },
      }),
      this.prisma.stock.count({ where }),
    ]);

    return {
      category,
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async crypto(slug: string, query: QueryCategoryAssetsDto) {
    const category = await this.prisma.sectorCategory.findUnique({ where: { slug } });
    if (!category) {
      throw new NotFoundException('Sector category not found');
    }

    const { page, limit, skip } = getPagination(query);
    const where = { assetCategories: { some: { categoryId: category.id } } };
    const [items, total] = await Promise.all([
      this.prisma.cryptoAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ marketCap: 'desc' }, { trendScore: 'desc' }],
        include: {
          assetCategories: {
            include: { category: true },
          },
        },
      }),
      this.prisma.cryptoAsset.count({ where }),
    ]);

    return {
      category,
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
