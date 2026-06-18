import { AssetType, Prisma } from "@prisma/client";
import { logger } from "../utils/logger";

const PORTFOLIO_ASSETS = [
  {
    assetType: AssetType.STOCK,
    assetSymbol: "ACCESSCORP",
    quantity: 1250,
    buyPrice: 19.8,
    notes: "Long-term NGX banking exposure",
  },
  {
    assetType: AssetType.STOCK,
    assetSymbol: "MTNN",
    quantity: 75,
    buyPrice: 210,
    notes: "Quality telecom cash flow play",
  },
  {
    assetType: AssetType.CRYPTO,
    assetSymbol: "BTC",
    quantity: 0.12,
    buyPrice: 82500,
    notes: "Core crypto allocation",
  },
  {
    assetType: AssetType.CRYPTO,
    assetSymbol: "ETH",
    quantity: 1.5,
    buyPrice: 2950,
    notes: "Smart contract ecosystem bet",
  },
];

export async function seedPortfolio(
  tx: Prisma.TransactionClient,
  demoUser: { id: string },
) {
  logger.info("Seeding demo portfolio...");

  for (const asset of PORTFOLIO_ASSETS) {
    await tx.portfolioAsset
      .create({ data: { userId: demoUser.id, ...asset } })
      .catch((err: unknown) => {
        const prismaErr = err as { code?: string };
        if (prismaErr.code !== "P2002") throw err;
      });
  }

  logger.progress("Portfolio assets", PORTFOLIO_ASSETS.length);
}
