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
exports.StocksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const paginate_util_1 = require("../../common/utils/paginate.util");
let StocksService = class StocksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const { limit, skip, page } = (0, paginate_util_1.getPagination)(query);
        const where = {
            AND: [
                query.sector ? { sector: query.sector } : {},
                query.category ? { assetCategories: { some: { category: { slug: query.category } } } } : {},
                query.provider ? { prices: { some: { provider: { slug: query.provider } } } } : {},
                query.q
                    ? {
                        OR: [
                            { ticker: { contains: query.q, mode: 'insensitive' } },
                            { companyName: { contains: query.q, mode: 'insensitive' } },
                        ],
                    }
                    : {},
            ],
        };
        const [items, total, sectors, providers] = await Promise.all([
            this.prisma.stock.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ trendScore: 'desc' }, { marketCap: 'desc' }],
                include: {
                    assetCategories: { include: { category: true } },
                },
            }),
            this.prisma.stock.count({ where }),
            this.prisma.stock.findMany({
                distinct: ['sector'],
                select: { sector: true },
                orderBy: { sector: 'asc' },
            }),
            this.prisma.stockDataProvider.findMany({
                where: { isActive: true },
                orderBy: [{ priority: 'asc' }, { name: 'asc' }],
            }),
        ]);
        return {
            items,
            sectors: sectors.map((item) => item.sector),
            providers: providers.map((item) => item.slug),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async detail(ticker) {
        const stock = await this.prisma.stock.findUnique({
            where: { ticker: ticker.toUpperCase() },
            include: {
                prices: {
                    orderBy: { date: 'asc' },
                    take: 365,
                    include: { provider: true },
                },
                assetCategories: {
                    include: { category: true },
                },
            },
        });
        if (!stock) {
            throw new common_1.NotFoundException('Stock not found');
        }
        const [comments, relatedNews, peers] = await Promise.all([
            this.prisma.comment.findMany({
                where: { assetType: 'STOCK', assetSymbol: stock.ticker, isModerated: false },
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
                    OR: [{ assetType: 'STOCK', assetSymbol: stock.ticker }, { category: { slug: 'equities' } }],
                },
                include: { sourceRef: true },
                orderBy: [{ trendingScore: 'desc' }, { publishedAt: 'desc' }],
                take: 6,
            }),
            this.prisma.stock.findMany({
                where: {
                    sector: stock.sector,
                    ticker: { not: stock.ticker },
                },
                take: 4,
                orderBy: { marketCap: 'desc' },
            }),
        ]);
        return {
            ...stock,
            comments,
            relatedNews,
            peers,
        };
    }
    trending() {
        return this.prisma.stock.findMany({
            take: 10,
            include: { assetCategories: { include: { category: true } } },
            orderBy: [{ trendScore: 'desc' }, { volume: 'desc' }],
        });
    }
    gainers() {
        return this.prisma.stock.findMany({
            take: 10,
            where: { percentChange: { gt: 0 } },
            orderBy: [{ percentChange: 'desc' }, { volume: 'desc' }],
        });
    }
    losers() {
        return this.prisma.stock.findMany({
            take: 10,
            where: { percentChange: { lt: 0 } },
            orderBy: [{ percentChange: 'asc' }, { volume: 'desc' }],
        });
    }
    providers() {
        return this.prisma.stockDataProvider.findMany({
            orderBy: [{ priority: 'asc' }, { name: 'asc' }],
            include: {
                statusLogs: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
};
exports.StocksService = StocksService;
exports.StocksService = StocksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StocksService);
//# sourceMappingURL=stocks.service.js.map