"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = seedCategories;
const categories_json_1 = __importDefault(require("../data/categories.json"));
const logger_1 = require("../utils/logger");
async function seedCategories(tx) {
    logger_1.logger.info("Seeding categories and providers...");
    const newsCategories = await Promise.all(categories_json_1.default.news.map((c) => tx.category.upsert({
        where: { slug: c.slug },
        update: c,
        create: c,
    })));
    const sectorCategories = await Promise.all(categories_json_1.default.sectors.map((c) => tx.sectorCategory.upsert({
        where: { slug: c.slug },
        update: c,
        create: c,
    })));
    const articleCategories = await Promise.all(categories_json_1.default.articles.map((c) => tx.articleCategory.upsert({
        where: { slug: c.slug },
        update: c,
        create: c,
    })));
    const newsSources = await Promise.all(categories_json_1.default.newsSources.map((s) => tx.newsSource.upsert({
        where: { slug: s.slug },
        update: { ...s, fetchStrategy: s.fetchStrategy },
        create: { ...s, fetchStrategy: s.fetchStrategy },
    })));
    const stockProviders = await Promise.all(categories_json_1.default.providers.map((p) => tx.stockDataProvider.upsert({
        where: { slug: p.slug },
        update: p,
        create: p,
    })));
    const sectorMap = new Map(sectorCategories.map((s) => [s.slug, s]));
    const newsCategoryMap = new Map(newsCategories.map((c) => [c.slug, c]));
    const articleCategoryMap = new Map(articleCategories.map((c) => [c.slug, c]));
    const newsSourceMap = new Map(newsSources.map((s) => [s.slug, s]));
    logger_1.logger.progress("News categories", newsCategories.length);
    logger_1.logger.progress("Sector categories", sectorCategories.length);
    logger_1.logger.progress("Article categories", articleCategories.length);
    logger_1.logger.progress("News sources", newsSources.length);
    logger_1.logger.progress("Stock providers", stockProviders.length);
    return {
        newsCategories,
        sectorCategories,
        articleCategories,
        newsSources,
        stockProviders,
        sectorMap,
        newsCategoryMap,
        articleCategoryMap,
        newsSourceMap,
        primaryProvider: stockProviders[0],
    };
}
//# sourceMappingURL=categories.js.map