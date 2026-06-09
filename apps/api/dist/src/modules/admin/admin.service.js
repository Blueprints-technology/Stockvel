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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async overview() {
        const [users, comments, jobs, news, stocks, crypto, newsletters, subscribers, providers] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.comment.count(),
            this.prisma.jobRun.findMany({ orderBy: { startedAt: 'desc' }, take: 10 }),
            this.prisma.news.count(),
            this.prisma.stock.count(),
            this.prisma.cryptoAsset.count(),
            this.prisma.newsletter.count(),
            this.prisma.newsletterSubscriber.count(),
            this.prisma.stockDataProvider.count(),
        ]);
        return {
            metrics: { users, comments, jobs: jobs.length, news, stocks, crypto, newsletters, subscribers, providers },
            jobs,
        };
    }
    users() {
        return this.prisma.user.findMany({
            include: { profile: true },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    comments(moderated) {
        return this.prisma.comment.findMany({
            where: typeof moderated === 'string' ? { isModerated: moderated === 'true' } : {},
            include: { user: { include: { profile: true } }, replies: true },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    moderateComment(commentId, isModerated) {
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { isModerated },
        });
    }
    publishNews(body) {
        return this.prisma.news.create({
            data: {
                title: String(body.title ?? ''),
                slug: String(body.slug ?? ''),
                excerpt: String(body.excerpt ?? ''),
                content: String(body.content ?? ''),
                source: String(body.source ?? ''),
                sourceUrl: String(body.sourceUrl ?? ''),
                imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : undefined,
                categoryId: typeof body.categoryId === 'string' ? body.categoryId : undefined,
                sourceId: typeof body.sourceId === 'string' ? body.sourceId : undefined,
                assetType: body.assetType,
                assetSymbol: typeof body.assetSymbol === 'string' ? body.assetSymbol : undefined,
                isInsight: Boolean(body.isInsight),
                trendingScore: Number(body.trendingScore ?? 50),
                publishedAt: body.publishedAt ? new Date(String(body.publishedAt)) : new Date(),
            },
        });
    }
    newsletters() {
        return this.prisma.newsletter.findMany({
            orderBy: [{ updatedAt: 'desc' }],
            take: 50,
        });
    }
    subscribers() {
        return this.prisma.newsletterSubscriber.findMany({
            orderBy: [{ isActive: 'desc' }, { subscribedAt: 'desc' }],
            take: 200,
        });
    }
    providerStatus() {
        return this.prisma.stockDataProvider.findMany({
            orderBy: [{ priority: 'asc' }, { name: 'asc' }],
            include: {
                statusLogs: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map