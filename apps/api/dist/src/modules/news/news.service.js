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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let NewsService = class NewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(query) {
        const where = {
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
    async detail(slug) {
        const news = await this.prisma.news.findUnique({
            where: { slug },
            include: { category: true, sourceRef: true },
        });
        if (!news) {
            throw new common_1.NotFoundException('News article not found');
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
    create(data) {
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
                assetType: data.assetType,
                assetSymbol: typeof data.assetSymbol === 'string' ? data.assetSymbol : undefined,
                isInsight: Boolean(data.isInsight),
                trendingScore: Number(data.trendingScore ?? 60),
                publishedAt: data.publishedAt ? new Date(String(data.publishedAt)) : new Date(),
            },
        });
    }
    update(id, data) {
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
                assetType: data.assetType,
                assetSymbol: typeof data.assetSymbol === 'string' ? data.assetSymbol : undefined,
                isInsight: typeof data.isInsight === 'boolean' ? data.isInsight : undefined,
                trendingScore: data.trendingScore ? Number(data.trendingScore) : undefined,
            },
        });
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsService);
//# sourceMappingURL=news.service.js.map