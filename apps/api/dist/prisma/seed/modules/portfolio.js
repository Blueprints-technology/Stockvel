"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPortfolio = seedPortfolio;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const PORTFOLIO_ASSETS = [
    {
        assetType: client_1.AssetType.STOCK,
        assetSymbol: "ACCESSCORP",
        quantity: 1250,
        buyPrice: 19.8,
        notes: "Long-term NGX banking exposure",
    },
    {
        assetType: client_1.AssetType.STOCK,
        assetSymbol: "MTNN",
        quantity: 75,
        buyPrice: 210,
        notes: "Quality telecom cash flow play",
    },
    {
        assetType: client_1.AssetType.CRYPTO,
        assetSymbol: "BTC",
        quantity: 0.12,
        buyPrice: 82500,
        notes: "Core crypto allocation",
    },
    {
        assetType: client_1.AssetType.CRYPTO,
        assetSymbol: "ETH",
        quantity: 1.5,
        buyPrice: 2950,
        notes: "Smart contract ecosystem bet",
    },
];
async function seedPortfolio(tx, demoUser) {
    logger_1.logger.info("Seeding demo portfolio...");
    for (const asset of PORTFOLIO_ASSETS) {
        await tx.portfolioAsset
            .create({ data: { userId: demoUser.id, ...asset } })
            .catch((err) => {
            const prismaErr = err;
            if (prismaErr.code !== "P2002")
                throw err;
        });
    }
    logger_1.logger.progress("Portfolio assets", PORTFOLIO_ASSETS.length);
}
//# sourceMappingURL=portfolio.js.map