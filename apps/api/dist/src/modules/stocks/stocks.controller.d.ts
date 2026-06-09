import { QueryStocksDto } from './dto/query-stocks.dto';
import { StocksService } from './stocks.service';
export declare class StocksController {
    private readonly stocksService;
    constructor(stocksService: StocksService);
    list(query: QueryStocksDto): Promise<{
        items: ({
            assetCategories: ({
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    description: string | null;
                    icon: string | null;
                    color: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                categoryId: string;
                stockId: string | null;
                cryptoAssetId: string | null;
            })[];
        } & {
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
        })[];
        sectors: string[];
        providers: string[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    providers(): import(".prisma/client").Prisma.PrismaPromise<({
        statusLogs: {
            status: import(".prisma/client").$Enums.ProviderHealthStatus;
            id: string;
            createdAt: Date;
            providerId: string;
            responseTimeMs: number;
            errorMessage: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        baseUrl: string;
        apiKey: string | null;
        priority: number;
        rateLimitPerMin: number;
        config: import("@prisma/client/runtime/library").JsonValue;
        lastFetchedAt: Date | null;
    })[]>;
    trending(): import(".prisma/client").Prisma.PrismaPromise<({
        assetCategories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                icon: string | null;
                color: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            categoryId: string;
            stockId: string | null;
            cryptoAssetId: string | null;
        })[];
    } & {
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
    })[]>;
    gainers(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    losers(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    detail(ticker: string): Promise<{
        comments: ({
            user: {
                profile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    displayName: string;
                    username: string;
                    avatarUrl: string | null;
                    bio: string | null;
                } | null;
            } & {
                id: string;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            replies: ({
                user: {
                    profile: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        displayName: string;
                        username: string;
                        avatarUrl: string | null;
                        bio: string | null;
                    } | null;
                } & {
                    id: string;
                    email: string;
                    passwordHash: string;
                    role: import(".prisma/client").$Enums.Role;
                    isEmailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                content: string;
                upvotes: number;
                isModerated: boolean;
                commentId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            assetType: import(".prisma/client").$Enums.AssetType;
            assetSymbol: string;
            content: string;
            upvotes: number;
            isModerated: boolean;
        })[];
        relatedNews: ({
            sourceRef: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                isActive: boolean;
                baseUrl: string;
                config: import("@prisma/client/runtime/library").JsonValue;
                lastFetchedAt: Date | null;
                logoUrl: string | null;
                fetchStrategy: import(".prisma/client").$Enums.FetchStrategy;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assetType: import(".prisma/client").$Enums.AssetType | null;
            assetSymbol: string | null;
            content: string;
            slug: string;
            title: string;
            excerpt: string;
            source: string;
            sourceUrl: string;
            externalUrl: string | null;
            author: string | null;
            imageUrl: string | null;
            categoryLabel: string | null;
            publishedAt: Date;
            isInsight: boolean;
            trendingScore: number;
            categoryId: string | null;
            sourceId: string | null;
        })[];
        peers: {
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
        }[];
        prices: ({
            provider: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                isActive: boolean;
                baseUrl: string;
                apiKey: string | null;
                priority: number;
                rateLimitPerMin: number;
                config: import("@prisma/client/runtime/library").JsonValue;
                lastFetchedAt: Date | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            volume: number | null;
            stockId: string;
            date: Date;
            open: number;
            high: number;
            low: number;
            close: number;
            providerId: string | null;
        })[];
        assetCategories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                icon: string | null;
                color: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            categoryId: string;
            stockId: string | null;
            cryptoAssetId: string | null;
        })[];
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
    }>;
}
