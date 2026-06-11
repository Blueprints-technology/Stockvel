"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedStocks = seedStocks;
const stocks_json_1 = __importDefault(require("../data/stocks.json"));
const validate_1 = require("../utils/validate");
const logger_1 = require("../utils/logger");
async function seedStocks(tx, sectorMap, primaryProviderId) {
    logger_1.logger.info("Seeding stocks and price history...");
    const stocks = stocks_json_1.default.map((s) => validate_1.StockSchema.parse(s));
    for (const stock of stocks) {
        const { sectorSlug, ...stockData } = stock;
        const created = await tx.stock.upsert({
            where: { ticker: stockData.ticker },
            update: { ...stockData, lastUpdatedAt: new Date() },
            create: { ...stockData, lastUpdatedAt: new Date() },
        });
        const category = sectorMap.get(sectorSlug);
        if (category) {
            const exists = await tx.assetCategory.findFirst({
                where: { stockId: created.id, categoryId: category.id },
            });
            if (!exists) {
                await tx.assetCategory.create({
                    data: { stockId: created.id, categoryId: category.id },
                });
            }
        }
        const now = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const base = stockData.currentPrice * (1 - i * 0.0015);
            const open = Number((base * 0.99).toFixed(2));
            const high = Number((base * 1.02).toFixed(2));
            const low = Number((base * 0.97).toFixed(2));
            const close = Number(base.toFixed(2));
            const volume = Math.max((stockData.volume ?? 10000) * (1 - i * 0.01), 1000);
            await tx.stockPrice.upsert({
                where: { stockId_date: { stockId: created.id, date } },
                update: {
                    open,
                    high,
                    low,
                    close,
                    volume,
                    providerId: primaryProviderId,
                },
                create: {
                    stockId: created.id,
                    providerId: primaryProviderId,
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
    logger_1.logger.progress("Stocks", stocks.length);
    logger_1.logger.progress("Stock price points", stocks.length * 31);
    return stocks;
}
//# sourceMappingURL=stocks.js.map