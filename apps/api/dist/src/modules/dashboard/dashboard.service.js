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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
                where: { status: client_1.ArticleStatus.PUBLISHED },
                take: 3,
                orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
                include: { category: true },
            }),
            this.prisma.researchReport.findMany({
                where: { status: client_1.ResearchReportStatus.PUBLISHED },
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map