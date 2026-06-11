"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedComments = seedComments;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
async function seedComments(tx, demoUser, admin) {
    logger_1.logger.info("Seeding comments and notifications...");
    const comment = await tx.comment
        .create({
        data: {
            userId: demoUser.id,
            assetType: client_1.AssetType.STOCK,
            assetSymbol: "ACCESSCORP",
            content: "Access is still one of the strongest liquidity stories on the NGX in my view.",
            upvotes: 12,
        },
    })
        .catch(async () => tx.comment.findFirstOrThrow({ where: { assetSymbol: "ACCESSCORP" } }));
    await tx.reply
        .create({
        data: {
            userId: admin.id,
            commentId: comment.id,
            content: "Watch net interest margin and capital adequacy updates as catalysts.",
            upvotes: 4,
        },
    })
        .catch((err) => {
        const prismaErr = err;
        if (prismaErr.code !== "P2002")
            throw err;
    });
    await tx.notification.createMany({
        data: [
            {
                userId: demoUser.id,
                title: "Watchlist updated",
                message: "BTC and ACCESSCORP remain on your watchlist with new price activity.",
                type: client_1.NotificationType.MARKET,
            },
            {
                userId: demoUser.id,
                title: "New insight published",
                message: "A new learning article and research report are available.",
                type: client_1.NotificationType.NEWS,
            },
        ],
        skipDuplicates: true,
    });
    logger_1.logger.progress("Comments + replies", 2);
    logger_1.logger.progress("Notifications", 2);
}
//# sourceMappingURL=comments.js.map