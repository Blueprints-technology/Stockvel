"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = require("./utils/logger");
const validate_1 = require("./utils/validate");
const users_1 = require("./modules/users");
const categories_1 = require("./modules/categories");
const stocks_1 = require("./modules/stocks");
const crypto_1 = require("./modules/crypto");
const market_index_1 = require("./modules/market-index");
const providers_1 = require("./modules/providers");
const news_1 = require("./modules/news");
const articles_1 = require("./modules/articles");
const research_1 = require("./modules/research");
const podcasts_1 = require("./modules/podcasts");
const treasury_1 = require("./modules/treasury");
const watchlist_1 = require("./modules/watchlist");
const portfolio_1 = require("./modules/portfolio");
const comments_1 = require("./modules/comments");
const newsletter_1 = require("./modules/newsletter");
const prisma = new client_1.PrismaClient();
const args = process.argv.slice(2);
const onlyArg = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const only = onlyArg ? onlyArg.split(",").map((s) => s.trim()) : [];
const shouldRun = (module) => only.length === 0 || only.includes(module);
async function main() {
    (0, validate_1.validateEnvironment)();
    const isProduction = process.env.NODE_ENV === "production";
    const allowSeed = process.env.ALLOW_SEED === "true";
    if (isProduction && !allowSeed) {
        logger_1.logger.warn("Production seeding is disabled. Set ALLOW_SEED=true to override.");
        return;
    }
    if (isProduction && allowSeed) {
        logger_1.logger.warn("⚠  Running seed in PRODUCTION — ALLOW_SEED=true is set.");
    }
    logger_1.logger.section("Stockvel Database Seed");
    logger_1.logger.info(`Environment: ${process.env.NODE_ENV ?? "development"}`);
    logger_1.logger.info(`Selective modules: ${only.length > 0 ? only.join(", ") : "all"}`);
    const startTime = Date.now();
    await prisma.$transaction(async (tx) => {
        const { admin, demoUser } = await (0, users_1.seedUsers)(tx);
        const { sectorMap, newsCategoryMap, articleCategoryMap, newsSourceMap, stockProviders, } = await (0, categories_1.seedCategories)(tx);
        const primaryProviderId = stockProviders[0].id;
        if (shouldRun("stocks")) {
            await (0, stocks_1.seedStocks)(tx, sectorMap, primaryProviderId);
        }
        if (shouldRun("crypto")) {
            await (0, crypto_1.seedCrypto)(tx, sectorMap);
        }
        if (shouldRun("market-index")) {
            await (0, market_index_1.seedMarketIndex)(tx);
        }
        if (shouldRun("providers")) {
            await (0, providers_1.seedProviderLogs)(tx, stockProviders);
        }
        if (shouldRun("news")) {
            await (0, news_1.seedNews)(tx, newsCategoryMap, newsSourceMap);
        }
        if (shouldRun("articles")) {
            await (0, articles_1.seedArticles)(tx, articleCategoryMap, demoUser.id);
        }
        if (shouldRun("research")) {
            await (0, research_1.seedResearch)(tx);
        }
        if (shouldRun("podcasts")) {
            await (0, podcasts_1.seedPodcasts)(tx);
        }
        if (shouldRun("treasury")) {
            await (0, treasury_1.seedTreasury)(tx);
        }
        if (shouldRun("watchlist")) {
            await (0, watchlist_1.seedWatchlist)(tx, demoUser);
        }
        if (shouldRun("portfolio")) {
            await (0, portfolio_1.seedPortfolio)(tx, demoUser);
        }
        if (shouldRun("comments")) {
            await (0, comments_1.seedComments)(tx, demoUser, admin);
        }
        if (shouldRun("newsletter")) {
            await (0, newsletter_1.seedNewsletter)(tx);
        }
    }, {
        maxWait: 15_000,
        timeout: 180_000,
    });
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger_1.logger.section(`Seed complete in ${elapsed}s`);
    logger_1.logger.success("Database seeded successfully.");
}
main()
    .catch((error) => {
    logger_1.logger.error("Seed failed with an unhandled error", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map