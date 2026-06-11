import { ArticleStatus, Prisma } from "@prisma/client";
import rawArticlesData from "../data/articles.json";
import { ArticleSchema } from "../utils/validate";
import { logger } from "../utils/logger";

export async function seedArticles(
  tx: Prisma.TransactionClient,
  articleCategoryMap: Map<string, { id: string }>,
  demoUserId: string,
) {
  logger.info("Seeding articles...");

  const articles = rawArticlesData.map((a) => ArticleSchema.parse(a));

  for (const article of articles) {
    const { categorySlug, ...rest } = article;
    const categoryId = articleCategoryMap.get(categorySlug)?.id;

    await tx.article.upsert({
      where: { slug: rest.slug },
      update: {
        ...rest,
        categoryId,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      create: {
        ...rest,
        categoryId,
        status: ArticleStatus.PUBLISHED,
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

  logger.progress("Articles", articles.length);
}
