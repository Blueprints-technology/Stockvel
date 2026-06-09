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
exports.WatchlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WatchlistService = class WatchlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWatchlist(userId) {
        const watchlist = await this.ensureWatchlist(userId);
        const items = await this.prisma.watchlistItem.findMany({
            where: { watchlistId: watchlist.id },
            orderBy: { position: 'asc' },
        });
        const stockSymbols = items.filter((item) => item.assetType === 'STOCK').map((item) => item.assetSymbol);
        const cryptoSymbols = items.filter((item) => item.assetType === 'CRYPTO').map((item) => item.assetSymbol);
        const [stocks, cryptos] = await Promise.all([
            this.prisma.stock.findMany({ where: { ticker: { in: stockSymbols } } }),
            this.prisma.cryptoAsset.findMany({ where: { symbol: { in: cryptoSymbols } } }),
        ]);
        return {
            ...watchlist,
            items: items.map((item) => ({
                ...item,
                asset: item.assetType === 'STOCK'
                    ? stocks.find((stock) => stock.ticker === item.assetSymbol)
                    : cryptos.find((crypto) => crypto.symbol === item.assetSymbol),
            })),
        };
    }
    async addItem(userId, dto) {
        const watchlist = await this.ensureWatchlist(userId);
        const count = await this.prisma.watchlistItem.count({ where: { watchlistId: watchlist.id } });
        return this.prisma.watchlistItem.upsert({
            where: {
                watchlistId_assetType_assetSymbol: {
                    watchlistId: watchlist.id,
                    assetType: dto.assetType,
                    assetSymbol: dto.assetSymbol.toUpperCase(),
                },
            },
            update: {},
            create: {
                watchlistId: watchlist.id,
                assetType: dto.assetType,
                assetSymbol: dto.assetSymbol.toUpperCase(),
                position: dto.position ?? count,
            },
        });
    }
    async reorder(userId, dto) {
        const watchlist = await this.ensureWatchlist(userId);
        await this.prisma.$transaction(dto.items.map((item, index) => this.prisma.watchlistItem.updateMany({
            where: {
                watchlistId: watchlist.id,
                assetType: item.assetType,
                assetSymbol: item.assetSymbol.toUpperCase(),
            },
            data: { position: item.position ?? index },
        })));
        return this.getWatchlist(userId);
    }
    async removeItem(userId, dto) {
        const watchlist = await this.ensureWatchlist(userId);
        await this.prisma.watchlistItem.deleteMany({
            where: {
                watchlistId: watchlist.id,
                assetType: dto.assetType,
                assetSymbol: dto.assetSymbol.toUpperCase(),
            },
        });
        return { success: true };
    }
    async ensureWatchlist(userId) {
        const existing = await this.prisma.watchlist.findFirst({ where: { userId } });
        if (existing) {
            return existing;
        }
        return this.prisma.watchlist.create({
            data: {
                userId,
                name: 'My Watchlist',
            },
        });
    }
};
exports.WatchlistService = WatchlistService;
exports.WatchlistService = WatchlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WatchlistService);
//# sourceMappingURL=watchlist.service.js.map