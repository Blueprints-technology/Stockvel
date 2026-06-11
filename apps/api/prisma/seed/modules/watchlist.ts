import { AssetType, Prisma } from "@prisma/client";
import { logger } from "../utils/logger";

export async function seedWatchlist(
  tx: Prisma.TransactionClient,
  demoUser: { id: string },
) {
  logger.info("Seeding demo watchlist...");

  await tx.watchlist
    .upsert({
      where: { id: "demo-watchlist-id" },
      update: {},
      create: {
        id: "demo-watchlist-id",
        userId: demoUser.id,
        name: "My Watchlist",
        items: {
          create: [
            {
              assetType: AssetType.STOCK,
              assetSymbol: "ACCESSCORP",
              position: 0,
            },
            { assetType: AssetType.STOCK, assetSymbol: "GTCO", position: 1 },
            { assetType: AssetType.CRYPTO, assetSymbol: "BTC", position: 2 },
            { assetType: AssetType.CRYPTO, assetSymbol: "ETH", position: 3 },
          ],
        },
      },
    })
    .catch(() => null);

  logger.progress("Watchlist items", 4);
}
