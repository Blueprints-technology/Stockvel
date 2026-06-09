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
exports.LearnService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const paginate_util_1 = require("../../common/utils/paginate.util");
let LearnService = class LearnService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listArticles(query, userId) {
        const { page, limit, skip } = (0, paginate_util_1.getPagination)(query);
        const where = {
            status: client_1.ArticleStatus.PUBLISHED,
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
                where: { status: client_1.ArticleStatus.PUBLISHED },
                take: 5,
                orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
                include: { category: true },
            }),
            this.prisma.article.findFirst({
                where: { status: client_1.ArticleStatus.PUBLISHED, isFeatured: true },
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
            where: { status: client_1.ArticleStatus.PUBLISHED, isFeatured: true },
            orderBy: [{ publishedAt: 'desc' }],
            take: 4,
            include: { category: true },
        });
    }
    async articleBySlug(slug, userId) {
        const article = await this.prisma.article.findUnique({
            where: { slug },
            include: {
                category: true,
                bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
            },
        });
        if (!article || article.status !== client_1.ArticleStatus.PUBLISHED) {
            throw new common_1.NotFoundException('Article not found');
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
    async related(slug) {
        const article = await this.prisma.article.findUnique({ where: { slug } });
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        return this.prisma.article.findMany({
            where: {
                id: { not: article.id },
                status: client_1.ArticleStatus.PUBLISHED,
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
    async toggleBookmark(slug, userId) {
        const article = await this.prisma.article.findUnique({ where: { slug } });
        if (!article || article.status !== client_1.ArticleStatus.PUBLISHED) {
            throw new common_1.NotFoundException('Article not found');
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
};
exports.LearnService = LearnService;
exports.LearnService = LearnService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LearnService);
//# sourceMappingURL=learn.service.js.map