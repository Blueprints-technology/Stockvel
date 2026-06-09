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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(query) {
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
                    status: client_1.ArticleStatus.PUBLISHED,
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
                    status: client_1.ResearchReportStatus.PUBLISHED,
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
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map