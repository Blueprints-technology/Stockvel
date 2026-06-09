"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let PortfolioService = class PortfolioService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPortfolio(userId) {
        const assets = await this.prisma.portfolioAsset.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        const stockSymbols = assets.filter((item) => item.assetType === client_1.AssetType.STOCK).map((item) => item.assetSymbol);
        const cryptoSymbols = assets.filter((item) => item.assetType === client_1.AssetType.CRYPTO).map((item) => item.assetSymbol);
        const [stocks, cryptos] = await Promise.all([
            this.prisma.stock.findMany({ where: { ticker: { in: stockSymbols } } }),
            this.prisma.cryptoAsset.findMany({ where: { symbol: { in: cryptoSymbols } } }),
        ]);
        const priceMap = new Map();
        const dailyChangeMap = new Map();
        stocks.forEach((stock) => {
            priceMap.set(`STOCK:${stock.ticker}`, stock.currentPrice);
            dailyChangeMap.set(`STOCK:${stock.ticker}`, stock.percentChange);
        });
        cryptos.forEach((asset) => {
            priceMap.set(`CRYPTO:${asset.symbol}`, asset.currentPrice);
            dailyChangeMap.set(`CRYPTO:${asset.symbol}`, asset.change24h);
        });
        const enrichedAssets = assets.map((asset) => {
            const key = `${asset.assetType}:${asset.assetSymbol}`;
            const currentPrice = priceMap.get(key) ?? asset.buyPrice;
            const currentValue = asset.quantity * currentPrice;
            const costBasis = asset.quantity * asset.buyPrice;
            const pnl = currentValue - costBasis;
            const allocationBase = currentValue;
            return {
                ...asset,
                currentPrice,
                currentValue,
                costBasis,
                pnl,
                dailyChangePct: dailyChangeMap.get(key) ?? 0,
                allocationBase,
            };
        });
        const totalValue = enrichedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
        const totalCost = enrichedAssets.reduce((sum, asset) => sum + asset.costBasis, 0);
        const totalPnl = totalValue - totalCost;
        const dailyChange = enrichedAssets.reduce((sum, asset) => sum + asset.currentValue * ((asset.dailyChangePct ?? 0) / 100), 0);
        return {
            assets: enrichedAssets.map((asset) => ({
                ...asset,
                allocationPct: totalValue ? Number(((asset.currentValue / totalValue) * 100).toFixed(2)) : 0,
            })),
            summary: {
                totalValue: Number(totalValue.toFixed(2)),
                totalCost: Number(totalCost.toFixed(2)),
                unrealizedPnl: Number(totalPnl.toFixed(2)),
                dailyChange: Number(dailyChange.toFixed(2)),
            },
        };
    }
    addAsset(userId, dto) {
        return this.prisma.portfolioAsset.create({
            data: {
                userId,
                assetType: dto.assetType,
                assetSymbol: dto.assetSymbol.toUpperCase(),
                quantity: dto.quantity,
                buyPrice: dto.buyPrice,
                notes: dto.notes,
            },
        });
    }
    async removeAsset(userId, id) {
        const asset = await this.prisma.portfolioAsset.findFirst({
            where: { id, userId },
        });
        if (!asset) {
            throw new common_1.NotFoundException('Portfolio asset not found');
        }
        await this.prisma.portfolioAsset.delete({ where: { id } });
        return { success: true };
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map