import { PrismaService } from '../../prisma/prisma.service';
import { UpsertPortfolioAssetDto } from './dto/upsert-portfolio-asset.dto';
export declare class PortfolioService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPortfolio(userId: string): Promise<{
        assets: {
            allocationPct: number;
            currentPrice: number;
            currentValue: number;
            costBasis: number;
            pnl: number;
            dailyChangePct: number;
            allocationBase: number;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            assetType: import(".prisma/client").$Enums.AssetType;
            assetSymbol: string;
            quantity: number;
            buyPrice: number;
            notes: string | null;
        }[];
        summary: {
            totalValue: number;
            totalCost: number;
            unrealizedPnl: number;
            dailyChange: number;
        };
    }>;
    addAsset(userId: string, dto: UpsertPortfolioAssetDto): import(".prisma/client").Prisma.Prisma__PortfolioAssetClient<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        assetType: import(".prisma/client").$Enums.AssetType;
        assetSymbol: string;
        quantity: number;
        buyPrice: number;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    removeAsset(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
