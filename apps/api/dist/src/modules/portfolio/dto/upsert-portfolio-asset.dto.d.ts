import { AssetType } from '@prisma/client';
export declare class UpsertPortfolioAssetDto {
    assetType: AssetType;
    assetSymbol: string;
    quantity: number;
    buyPrice: number;
    notes?: string;
}
