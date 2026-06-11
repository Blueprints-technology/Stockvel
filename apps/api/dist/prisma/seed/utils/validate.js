"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasurySchema = exports.PodcastSchema = exports.ResearchReportSchema = exports.ArticleSchema = exports.NewsItemSchema = exports.CryptoSchema = exports.StockSchema = void 0;
exports.validateEnvironment = validateEnvironment;
const zod_1 = require("zod");
const logger_1 = require("./logger");
function validateEnvironment() {
    const schema = zod_1.z.object({
        DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
        NODE_ENV: zod_1.z
            .enum(["development", "test", "production"])
            .default("development"),
    });
    const result = schema.safeParse(process.env);
    if (!result.success) {
        logger_1.logger.error("Environment validation failed:");
        result.error.issues.forEach((issue) => logger_1.logger.error(`  ${issue.path.join(".")}: ${issue.message}`));
        process.exit(1);
    }
    return result.data;
}
exports.StockSchema = zod_1.z.object({
    ticker: zod_1.z.string().min(1).max(15),
    companyName: zod_1.z.string().min(1),
    sector: zod_1.z.string().min(1),
    currentPrice: zod_1.z.number().nonnegative(),
    dailyChange: zod_1.z.number(),
    percentChange: zod_1.z.number(),
    marketCap: zod_1.z.number().positive().optional(),
    eps: zod_1.z.number().optional(),
    peRatio: zod_1.z.number().optional(),
    dividendYield: zod_1.z.number().min(0).max(1).optional(),
    volume: zod_1.z.number().nonnegative().optional(),
    week52High: zod_1.z.number().optional(),
    week52Low: zod_1.z.number().optional(),
    trendScore: zod_1.z.number().min(0).max(100),
    sectorSlug: zod_1.z.string(),
});
exports.CryptoSchema = zod_1.z.object({
    symbol: zod_1.z.string().min(1).max(10),
    name: zod_1.z.string().min(1),
    coingeckoId: zod_1.z.string().min(1),
    currentPrice: zod_1.z.number().nonnegative(),
    marketCap: zod_1.z.number().positive().optional(),
    change24h: zod_1.z.number(),
    volume24h: zod_1.z.number().nonnegative().optional(),
    circulatingSupply: zod_1.z.number().positive().optional(),
    trendScore: zod_1.z.number().min(0).max(100),
    imageUrl: zod_1.z.string().url().optional(),
    sectorSlug: zod_1.z.string(),
});
exports.NewsItemSchema = zod_1.z.object({
    categorySlug: zod_1.z.string(),
    sourceSlug: zod_1.z.string(),
    slug: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    source: zod_1.z.string().min(1),
    sourceUrl: zod_1.z.string().url(),
    assetType: zod_1.z.enum(["STOCK", "CRYPTO"]).nullable(),
    assetSymbol: zod_1.z.string().nullable(),
    isInsight: zod_1.z.boolean(),
    trendingScore: zod_1.z.number().min(0).max(100),
    categoryLabel: zod_1.z.string().optional(),
});
exports.ArticleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    author: zod_1.z.string().min(1),
    categorySlug: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()),
    isFeatured: zod_1.z.boolean(),
    readTime: zod_1.z.number().positive().int(),
});
exports.ResearchReportSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    type: zod_1.z.enum(["MARKET_COVERAGE", "ANALYSIS", "ECONOMY", "STRATEGY"]),
    summary: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    reportYear: zod_1.z.number().int().min(2020).max(2030),
    author: zod_1.z.string().min(1),
    tags: zod_1.z.array(zod_1.z.string()),
    downloadCount: zod_1.z.number().nonnegative().int(),
    isPremium: zod_1.z.boolean(),
});
exports.PodcastSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    audioUrl: zod_1.z.string().url(),
    duration: zod_1.z.number().positive().int(),
    episodeNumber: zod_1.z.number().positive().int(),
    seasonNumber: zod_1.z.number().positive().int(),
    tags: zod_1.z.array(zod_1.z.string()),
    id: zod_1.z.string().uuid().optional(),
    playCount: zod_1.z.number().nonnegative().int().optional(),
    createdAt: zod_1.z.union([zod_1.z.string().datetime(), zod_1.z.date()]).optional(),
    updatedAt: zod_1.z.union([zod_1.z.string().datetime(), zod_1.z.date()]).optional(),
    publishedAt: zod_1.z.union([zod_1.z.string().datetime(), zod_1.z.date()]).optional(),
    coverImage: zod_1.z.string().url().optional(),
    source: zod_1.z.string().optional(),
    region: zod_1.z.string().optional(),
});
exports.TreasurySchema = zod_1.z.object({
    tenor: zod_1.z.string().min(1),
    rate: zod_1.z.string().regex(/^\d+\.\d{4}$/, "Rate must be decimal with 4 places"),
    source: zod_1.z.string().min(1),
});
//# sourceMappingURL=validate.js.map