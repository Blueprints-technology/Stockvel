import { PrismaClient } from "@prisma/client";
import { logger } from "./utils/logger";
import { validateEnvironment } from "./utils/validate";
import { seedUsers } from "./modules/users";
import { seedCategories } from "./modules/categories";
import { seedStocks } from "./modules/stocks";
import { seedCrypto } from "./modules/crypto";
import { seedMarketIndex } from "./modules/market-index";
import { seedProviderLogs } from "./modules/providers";
import { seedNews } from "./modules/news";
import { seedArticles } from "./modules/articles";
import { seedResearch } from "./modules/research";
import { seedPodcasts } from "./modules/podcasts";
import { seedTreasury } from "./modules/treasury";
import { seedWatchlist } from "./modules/watchlist";
import { seedPortfolio } from "./modules/portfolio";
import { seedComments } from "./modules/comments";
import { seedNewsletter } from "./modules/newsletter";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const onlyArg = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const only = onlyArg ? onlyArg.split(",").map((s) => s.trim()) : [];
const shouldRun = (module: string) =>
  only.length === 0 || only.includes(module);

async function main() {
  validateEnvironment();

  const isProduction = process.env.NODE_ENV === "production";
  const allowSeed = process.env.ALLOW_SEED === "true";

  if (isProduction && !allowSeed) {
    logger.warn(
      "Production seeding is disabled. Set ALLOW_SEED=true to override.",
    );
    return;
  }

  if (isProduction && allowSeed) {
    logger.warn("⚠  Running seed in PRODUCTION — ALLOW_SEED=true is set.");
  }

  logger.section("Stockvel Database Seed");
  logger.info(`Environment: ${process.env.NODE_ENV ?? "development"}`);
  logger.info(
    `Selective modules: ${only.length > 0 ? only.join(", ") : "all"}`,
  );

  const startTime = Date.now();

  await prisma.$transaction(
    async (tx) => {
      const { admin, demoUser } = await seedUsers(tx);

      const {
        sectorMap,
        newsCategoryMap,
        articleCategoryMap,
        newsSourceMap,
        stockProviders,
      } = await seedCategories(tx);

      const primaryProviderId = stockProviders[0].id;

      if (shouldRun("stocks")) {
        await seedStocks(tx, sectorMap, primaryProviderId);
      }

      if (shouldRun("crypto")) {
        await seedCrypto(tx, sectorMap);
      }

      if (shouldRun("market-index")) {
        await seedMarketIndex(tx);
      }

      if (shouldRun("providers")) {
        await seedProviderLogs(tx, stockProviders);
      }

      if (shouldRun("news")) {
        await seedNews(tx, newsCategoryMap, newsSourceMap);
      }

      if (shouldRun("articles")) {
        await seedArticles(tx, articleCategoryMap, demoUser.id);
      }

      if (shouldRun("research")) {
        await seedResearch(tx);
      }

      if (shouldRun("podcasts")) {
        await seedPodcasts(tx);
      }

      if (shouldRun("treasury")) {
        await seedTreasury(tx);
      }

      if (shouldRun("watchlist")) {
        await seedWatchlist(tx, demoUser);
      }

      if (shouldRun("portfolio")) {
        await seedPortfolio(tx, demoUser);
      }

      if (shouldRun("comments")) {
        await seedComments(tx, demoUser, admin);
      }

      if (shouldRun("newsletter")) {
        await seedNewsletter(tx);
      }
    },
    {
      maxWait: 15_000,
      timeout: 180_000,
    },
  );

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  logger.section(`Seed complete in ${elapsed}s`);
  logger.success("Database seeded successfully.");
}

main()
  .catch((error) => {
    logger.error("Seed failed with an unhandled error", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
