import { type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { UpsertPortfolioAssetDto } from './dto/upsert-portfolio-asset.dto';
import { PortfolioService } from './portfolio.service';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    getPortfolio(user: AuthenticatedUser): Promise<{
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
    addAsset(user: AuthenticatedUser, dto: UpsertPortfolioAssetDto): import(".prisma/client").Prisma.Prisma__PortfolioAssetClient<{
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
    removeAsset(user: AuthenticatedUser, id: string): Promise<{
        success: boolean;
    }>;
}
