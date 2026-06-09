"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const paginate_util_1 = require("../../common/utils/paginate.util");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        const categories = await this.prisma.sectorCategory.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { assetMappings: true },
                },
            },
        });
        const topMovers = await Promise.all(categories.map(async (category) => {
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
        }));
        return topMovers;
    }
    async detail(slug) {
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
            throw new common_1.NotFoundException('Sector category not found');
        }
        const stocks = category.assetMappings
            .map((mapping) => mapping.stock)
            .filter((stock) => Boolean(stock))
            .sort((a, b) => b.percentChange - a.percentChange);
        const crypto = category.assetMappings
            .map((mapping) => mapping.cryptoAsset)
            .filter((asset) => Boolean(asset))
            .sort((a, b) => b.change24h - a.change24h);
        return {
            ...category,
            stocks,
            crypto,
        };
    }
    async stocks(slug, query) {
        const category = await this.prisma.sectorCategory.findUnique({ where: { slug } });
        if (!category) {
            throw new common_1.NotFoundException('Sector category not found');
        }
        const { page, limit, skip } = (0, paginate_util_1.getPagination)(query);
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
    async crypto(slug, query) {
        const category = await this.prisma.sectorCategory.findUnique({ where: { slug } });
        if (!category) {
            throw new common_1.NotFoundException('Sector category not found');
        }
        const { page, limit, skip } = (0, paginate_util_1.getPagination)(query);
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
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map