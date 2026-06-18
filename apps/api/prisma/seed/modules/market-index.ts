import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger";

export async function seedMarketIndex(tx: Prisma.TransactionClient) {
  logger.info("Seeding market index...");

  await tx.marketIndex.upsert({
    where: { symbol: "NGXASI" },
    update: {
      name: "NGX All-Share Index",
      value: 98512.44,
      change: 111.7,
      percentChange: 0.11,
      marketCap: 56300000000000,
      breadthAdvancers: 31,
      breadthDecliners: 17,
      fearGreed: 58,
      tradeDate: new Date(),
    },
    create: {
      symbol: "NGXASI",
      name: "NGX All-Share Index",
      value: 98512.44,
      change: 111.7,
      percentChange: 0.11,
      marketCap: 56300000000000,
      breadthAdvancers: 31,
      breadthDecliners: 17,
      fearGreed: 58,
      tradeDate: new Date(),
    },
  });

  logger.progress("Market indices", 1);
}
