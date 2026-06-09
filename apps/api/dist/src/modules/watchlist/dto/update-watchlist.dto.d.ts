import { AssetType } from '@prisma/client';
export declare class WatchlistItemDto {
    assetType: AssetType;
    assetSymbol: string;
    position?: number;
}
export declare class ReorderWatchlistDto {
    items: WatchlistItemDto[];
}
