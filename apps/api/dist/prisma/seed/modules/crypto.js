"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCrypto = seedCrypto;
const crypto_json_1 = __importDefault(require("../data/crypto.json"));
const validate_1 = require("../utils/validate");
const logger_1 = require("../utils/logger");
async function seedCrypto(tx, sectorMap) {
    logger_1.logger.info("Seeding crypto assets and price history...");
    const cryptos = crypto_json_1.default.map((c) => validate_1.CryptoSchema.parse(c));
    for (const crypto of cryptos) {
        const { sectorSlug, ...cryptoData } = crypto;
        const created = await tx.cryptoAsset.upsert({
            where: { symbol: cryptoData.symbol },
            update: { ...cryptoData, lastUpdatedAt: new Date() },
            create: { ...cryptoData, lastUpdatedAt: new Date() },
        });
        const category = sectorMap.get(sectorSlug);
        if (category) {
            const exists = await tx.assetCategory.findFirst({
                where: { cryptoAssetId: created.id, categoryId: category.id },
            });
            if (!exists) {
                await tx.assetCategory.create({
                    data: { cryptoAssetId: created.id, categoryId: category.id },
                });
            }
        }
        const now = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const base = cryptoData.currentPrice * (1 - i * 0.0025);
            const open = Number((base * 0.99).toFixed(2));
            const high = Number((base * 1.03).toFixed(2));
            const low = Number((base * 0.96).toFixed(2));
            const close = Number(base.toFixed(2));
            const volume = Math.max((cryptoData.volume24h ?? 10000) * (1 - i * 0.01), 1000);
            await tx.cryptoPrice.upsert({
                where: { cryptoAssetId_date: { cryptoAssetId: created.id, date } },
                update: { open, high, low, close, volume },
                create: {
                    cryptoAssetId: created.id,
                    date,
                    open,
                    high,
                    low,
                    close,
                    volume,
                },
            });
        }
    }
    logger_1.logger.progress("Crypto assets", cryptos.length);
    logger_1.logger.progress("Crypto price points", cryptos.length * 31);
    return cryptos;
}
//# sourceMappingURL=crypto.js.map