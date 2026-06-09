import { type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { ReorderWatchlistDto, WatchlistItemDto } from './dto/update-watchlist.dto';
import { WatchlistService } from './watchlist.service';
export declare class WatchlistController {
    private readonly watchlistService;
    constructor(watchlistService: WatchlistService);
    getWatchlist(user: AuthenticatedUser): Promise<{
        items: {
            asset: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                ticker: string;
                companyName: string;
                sector: string;
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
                imageUrl: string | null;
                description: string | null;
                currentPrice: number;
                marketCap: number | null;
                trendScore: number;
                lastUpdatedAt: Date | null;
                coingeckoId: string;
                change24h: number;
                volume24h: number | null;
                circulatingSupply: number | null;
            } | undefined;
            id: string;
            createdAt: Date;
            assetType: import(".prisma/client").$Enums.AssetType;
            assetSymbol: string;
            position: number;
            watchlistId: string;
        }[];
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addItem(user: AuthenticatedUser, dto: WatchlistItemDto): Promise<{
        id: string;
        createdAt: Date;
        assetType: import(".prisma/client").$Enums.AssetType;
        assetSymbol: string;
        position: number;
        watchlistId: string;
    }>;
    reorder(user: AuthenticatedUser, dto: ReorderWatchlistDto): Promise<{
        items: {
            asset: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                ticker: string;
                companyName: string;
                sector: string;
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
                imageUrl: string | null;
                description: string | null;
                currentPrice: number;
                marketCap: number | null;
                trendScore: number;
                lastUpdatedAt: Date | null;
                coingeckoId: string;
                change24h: number;
                volume24h: number | null;
                circulatingSupply: number | null;
            } | undefined;
            id: string;
            createdAt: Date;
            assetType: import(".prisma/client").$Enums.AssetType;
            assetSymbol: string;
            position: number;
            watchlistId: string;
        }[];
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    removeItem(user: AuthenticatedUser, dto: WatchlistItemDto): Promise<{
        success: boolean;
    }>;
}
