import { AssetType, NotificationType, Prisma } from "@prisma/client";
import { logger } from "../utils/logger";

export async function seedComments(
  tx: Prisma.TransactionClient,
  demoUser: { id: string },
  admin: { id: string },
) {
  logger.info("Seeding comments and notifications...");

  const comment = await tx.comment
    .create({
      data: {
        userId: demoUser.id,
        assetType: AssetType.STOCK,
        assetSymbol: "ACCESSCORP",
        content:
          "Access is still one of the strongest liquidity stories on the NGX in my view.",
        upvotes: 12,
      },
    })
    .catch(async () =>
      tx.comment.findFirstOrThrow({ where: { assetSymbol: "ACCESSCORP" } }),
    );

  await tx.reply
    .create({
      data: {
        userId: admin.id,
        commentId: comment.id,
        content:
          "Watch net interest margin and capital adequacy updates as catalysts.",
        upvotes: 4,
      },
    })
    .catch((err: unknown) => {
      const prismaErr = err as { code?: string };
      if (prismaErr.code !== "P2002") throw err;
    });

  await tx.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        title: "Watchlist updated",
        message:
          "BTC and ACCESSCORP remain on your watchlist with new price activity.",
        type: NotificationType.MARKET,
      },
      {
        userId: demoUser.id,
        title: "New insight published",
        message: "A new learning article and research report are available.",
        type: NotificationType.NEWS,
      },
    ],
    skipDuplicates: true,
  });

  logger.progress("Comments + replies", 2);
  logger.progress("Notifications", 2);
}
