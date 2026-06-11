"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedNews = seedNews;
const news_json_1 = __importDefault(require("../data/news.json"));
const validate_1 = require("../utils/validate");
const logger_1 = require("../utils/logger");
async function seedNews(tx, newsCategoryMap, newsSourceMap) {
    logger_1.logger.info("Seeding news items...");
    const newsItems = news_json_1.default.map((n) => validate_1.NewsItemSchema.parse(n));
    for (const item of newsItems) {
        const { categorySlug, sourceSlug, ...rest } = item;
        const categoryId = newsCategoryMap.get(categorySlug)?.id;
        const sourceId = newsSourceMap.get(sourceSlug)?.id;
        await tx.news.upsert({
            where: { sourceUrl: rest.sourceUrl },
            update: {
                ...rest,
                categoryId,
                sourceId,
                assetType: rest.assetType,
                publishedAt: new Date(),
            },
            create: {
                ...rest,
                categoryId,
                sourceId,
                assetType: rest.assetType,
                publishedAt: new Date(),
            },
        });
    }
    logger_1.logger.progress("News items", newsItems.length);
}
//# sourceMappingURL=news.js.map