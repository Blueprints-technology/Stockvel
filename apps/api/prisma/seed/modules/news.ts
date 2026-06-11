import { AssetType, Prisma } from "@prisma/client";
import rawNewsData from "../data/news.json";
import { NewsItemSchema } from "../utils/validate";
import { logger } from "../utils/logger";

export async function seedNews(
  tx: Prisma.TransactionClient,
  newsCategoryMap: Map<string, { id: string }>,
  newsSourceMap: Map<string, { id: string }>,
) {
  logger.info("Seeding news items...");

  const newsItems = rawNewsData.map((n) => NewsItemSchema.parse(n));

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
        assetType: rest.assetType as AssetType | null,
        publishedAt: new Date(),
      },
      create: {
        ...rest,
        categoryId,
        sourceId,
        assetType: rest.assetType as AssetType | null,
        publishedAt: new Date(),
      },
    });
  }

  logger.progress("News items", newsItems.length);
}
