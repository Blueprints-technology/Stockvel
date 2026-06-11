import { z } from "zod";
import { logger } from "./logger";

export function validateEnvironment() {
  const schema = z.object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  });

  const result = schema.safeParse(process.env);
  if (!result.success) {
    logger.error("Environment validation failed:");
    result.error.issues.forEach((issue) =>
      logger.error(`  ${issue.path.join(".")}: ${issue.message}`),
    );
    process.exit(1);
  }

  return result.data;
}

export const StockSchema = z.object({
  ticker: z.string().min(1).max(15),
  companyName: z.string().min(1),
  sector: z.string().min(1),
  currentPrice: z.number().nonnegative(),
  dailyChange: z.number(),
  percentChange: z.number(),
  marketCap: z.number().positive().optional(),
  eps: z.number().optional(),
  peRatio: z.number().optional(),
  dividendYield: z.number().min(0).max(1).optional(),
  volume: z.number().nonnegative().optional(),
  week52High: z.number().optional(),
  week52Low: z.number().optional(),
  trendScore: z.number().min(0).max(100),
  sectorSlug: z.string(),
});

export const CryptoSchema = z.object({
  symbol: z.string().min(1).max(10),
  name: z.string().min(1),
  coingeckoId: z.string().min(1),
  currentPrice: z.number().nonnegative(),
  marketCap: z.number().positive().optional(),
  change24h: z.number(),
  volume24h: z.number().nonnegative().optional(),
  circulatingSupply: z.number().positive().optional(),
  trendScore: z.number().min(0).max(100),
  imageUrl: z.string().url().optional(),
  sectorSlug: z.string(),
});

export const NewsItemSchema = z.object({
  categorySlug: z.string(),
  sourceSlug: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  source: z.string().min(1),
  sourceUrl: z.string().url(),
  assetType: z.enum(["STOCK", "CRYPTO"]).nullable(),
  assetSymbol: z.string().nullable(),
  isInsight: z.boolean(),
  trendingScore: z.number().min(0).max(100),
  categoryLabel: z.string().optional(),
});

export const ArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  categorySlug: z.string(),
  tags: z.array(z.string()),
  isFeatured: z.boolean(),
  readTime: z.number().positive().int(),
});

export const ResearchReportSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(["MARKET_COVERAGE", "ANALYSIS", "ECONOMY", "STRATEGY"]),
  summary: z.string().min(1),
  content: z.string().min(1),
  reportYear: z.number().int().min(2020).max(2030),
  author: z.string().min(1),
  tags: z.array(z.string()),
  downloadCount: z.number().nonnegative().int(),
  isPremium: z.boolean(),
});

export const PodcastSchema = z.object({
  // Required fields (match Prisma schema)
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  audioUrl: z.string().url(),
  duration: z.number().positive().int(),
  episodeNumber: z.number().positive().int(),
  seasonNumber: z.number().positive().int(),
  tags: z.array(z.string()),

  id: z.string().uuid().optional(),
  playCount: z.number().nonnegative().int().optional(),
  createdAt: z.union([z.string().datetime(), z.date()]).optional(),
  updatedAt: z.union([z.string().datetime(), z.date()]).optional(),
  publishedAt: z.union([z.string().datetime(), z.date()]).optional(),
  coverImage: z.string().url().optional(),

  source: z.string().optional(),
  region: z.string().optional(),
});

export const TreasurySchema = z.object({
  tenor: z.string().min(1),
  rate: z.string().regex(/^\d+\.\d{4}$/, "Rate must be decimal with 4 places"),
  source: z.string().min(1),
});

export type StockInput = z.infer<typeof StockSchema>;
export type CryptoInput = z.infer<typeof CryptoSchema>;
export type NewsItemInput = z.infer<typeof NewsItemSchema>;
export type ArticleInput = z.infer<typeof ArticleSchema>;
export type ResearchReportInput = z.infer<typeof ResearchReportSchema>;
export type PodcastInput = z.infer<typeof PodcastSchema>;
export type TreasuryInput = z.infer<typeof TreasurySchema>;
