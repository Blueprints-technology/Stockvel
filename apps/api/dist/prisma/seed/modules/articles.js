"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedArticles = seedArticles;
const client_1 = require("@prisma/client");
const articles_json_1 = __importDefault(require("../data/articles.json"));
const validate_1 = require("../utils/validate");
const logger_1 = require("../utils/logger");
async function seedArticles(tx, articleCategoryMap, demoUserId) {
    logger_1.logger.info("Seeding articles...");
    const articles = articles_json_1.default.map((a) => validate_1.ArticleSchema.parse(a));
    for (const article of articles) {
        const { categorySlug, ...rest } = article;
        const categoryId = articleCategoryMap.get(categorySlug)?.id;
        await tx.article.upsert({
            where: { slug: rest.slug },
            update: {
                ...rest,
                categoryId,
                status: client_1.ArticleStatus.PUBLISHED,
                publishedAt: new Date(),
            },
            create: {
                ...rest,
                categoryId,
                status: client_1.ArticleStatus.PUBLISHED,
                publishedAt: new Date(),
            },
        });
    }
    const featuredSlug = articles.find((a) => a.isFeatured)?.slug;
    if (featuredSlug) {
        const target = await tx.article.findUnique({
            where: { slug: featuredSlug },
        });
        if (target) {
            await tx.articleBookmark
                .upsert({
                where: {
                    userId_articleId: { userId: demoUserId, articleId: target.id },
                },
                update: {},
                create: { userId: demoUserId, articleId: target.id },
            })
                .catch(() => null);
        }
    }
    logger_1.logger.progress("Articles", articles.length);
}
//# sourceMappingURL=articles.js.map