import { FetchStrategy, Prisma } from "@prisma/client";
import categoriesData from "../data/categories.json";
import { logger } from "../utils/logger";

export async function seedCategories(tx: Prisma.TransactionClient) {
  logger.info("Seeding categories and providers...");

  const newsCategories = await Promise.all(
    categoriesData.news.map((c) =>
      tx.category.upsert({
        where: { slug: c.slug },
        update: c,
        create: c,
      }),
    ),
  );

  const sectorCategories = await Promise.all(
    categoriesData.sectors.map((c) =>
      tx.sectorCategory.upsert({
        where: { slug: c.slug },
        update: c,
        create: c,
      }),
    ),
  );

  const articleCategories = await Promise.all(
    categoriesData.articles.map((c) =>
      tx.articleCategory.upsert({
        where: { slug: c.slug },
        update: c,
        create: c,
      }),
    ),
  );

  const newsSources = await Promise.all(
    categoriesData.newsSources.map((s) =>
      tx.newsSource.upsert({
        where: { slug: s.slug },
        update: { ...s, fetchStrategy: s.fetchStrategy as FetchStrategy },
        create: { ...s, fetchStrategy: s.fetchStrategy as FetchStrategy },
      }),
    ),
  );

  const stockProviders = await Promise.all(
    categoriesData.providers.map((p) =>
      tx.stockDataProvider.upsert({
        where: { slug: p.slug },
        update: p,
        create: p,
      }),
    ),
  );

  const sectorMap = new Map(sectorCategories.map((s) => [s.slug, s]));
  const newsCategoryMap = new Map(newsCategories.map((c) => [c.slug, c]));
  const articleCategoryMap = new Map(articleCategories.map((c) => [c.slug, c]));
  const newsSourceMap = new Map(newsSources.map((s) => [s.slug, s]));

  logger.progress("News categories", newsCategories.length);
  logger.progress("Sector categories", sectorCategories.length);
  logger.progress("Article categories", articleCategories.length);
  logger.progress("News sources", newsSources.length);
  logger.progress("Stock providers", stockProviders.length);

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
