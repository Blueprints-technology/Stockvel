import { PrismaService } from '../../prisma/prisma.service';
import { ReorderWatchlistDto, WatchlistItemDto } from './dto/update-watchlist.dto';
export declare class WatchlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWatchlist(userId: string): Promise<{
        items: {
            asset: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                ticker: string;
                companyName: string;
                sector: string;
                description: string | null;
                currentPrice: number;
                dailyChange: number;
                percentChange: number;
                marketCap: number | null;
                eps: number | null;
                peRatio: number | null;
                dividendYield: number | null;
                volume: number | null;
                week52High: number | null;
                week52Low: number | null;
                trendScore: number;
                lastUpdatedAt: Date | null;
            } | {
                symbol: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                currentPrice: number;
                marketCap: number | null;
                trendScore: number;
                lastUpdatedAt: Date | null;
                coingeckoId: string;
                imageUrl: string | null;
                change24h: number;
                volume24h: number | null;
                circulatingSupply: number | null;
            } | undefined;
            id: string;
            createdAt: Date;
            watchlistId: string;
            assetType: import(".prisma/client").$Enums.AssetType;
            assetSymbol: string;
            position: number;
        }[];
        id: string;
        userId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addItem(userId: string, dto: WatchlistItemDto): Promise<{
        id: string;
        createdAt: Date;
        watchlistId: string;
        assetType: import(".prisma/client").$Enums.AssetType;
        assetSymbol: string;
        position: number;
    }>;
    reorder(userId: string, dto: ReorderWatchlistDto): Promise<{
        items: {
            asset: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                ticker: string;
                companyName: string;
                sector: string;
                description: string | null;
                currentPrice: number;
                dailyChange: number;
                percentChange: number;
                marketCap: number | null;
                eps: number | null;
                peRatio: number | null;
                dividendYield: number | null;
                volume: number | null;
                week52High: number | null;
                week52Low: number | null;
                trendScore: number;
                lastUpdatedAt: Date | null;
            } | {
                symbol: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                currentPrice: number;
                marketCap: number | null;
                trendScore: number;
                lastUpdatedAt: Date | null;
                coingeckoId: string;
                imageUrl: string | null;
                change24h: number;
                volume24h: number | null;
                circulatingSupply: number | null;
            } | undefined;
            id: string;
            createdAt: Date;
            watchlistId: string;
            assetType: import(".prisma/client").$Enums.AssetType;
            assetSymbol: string;
            position: number;
        }[];
        id: string;
        userId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeItem(userId: string, dto: WatchlistItemDto): Promise<{
        success: boolean;
    }>;
    private ensureWatchlist;
}
