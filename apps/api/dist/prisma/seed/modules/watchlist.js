"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedWatchlist = seedWatchlist;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
async function seedWatchlist(tx, demoUser) {
    logger_1.logger.info("Seeding demo watchlist...");
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
                        assetType: client_1.AssetType.STOCK,
                        assetSymbol: "ACCESSCORP",
                        position: 0,
                    },
                    { assetType: client_1.AssetType.STOCK, assetSymbol: "GTCO", position: 1 },
                    { assetType: client_1.AssetType.CRYPTO, assetSymbol: "BTC", position: 2 },
                    { assetType: client_1.AssetType.CRYPTO, assetSymbol: "ETH", position: 3 },
                ],
            },
        },
    })
        .catch(() => null);
    logger_1.logger.progress("Watchlist items", 4);
}
//# sourceMappingURL=watchlist.js.map