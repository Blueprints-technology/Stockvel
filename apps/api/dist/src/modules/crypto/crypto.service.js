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
exports.CryptoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const paginate_util_1 = require("../../common/utils/paginate.util");
let CryptoService = class CryptoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const { limit, skip, page } = (0, paginate_util_1.getPagination)(query);
        const where = {
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
    async detail(symbol) {
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
            throw new common_1.NotFoundException('Crypto asset not found');
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
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CryptoService);
//# sourceMappingURL=crypto.service.js.map