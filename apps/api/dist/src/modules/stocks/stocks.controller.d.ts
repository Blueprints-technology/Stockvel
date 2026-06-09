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
                    description: string | null;
                    slug: string;
                    icon: string | null;
                    color: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                stockId: string | null;
                cryptoAssetId: string | null;
                categoryId: string;
            })[];
        } & {
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
            id: string;
            createdAt: Date;
            providerId: string;
            status: import(".prisma/client").$Enums.ProviderHealthStatus;
            responseTimeMs: number;
            errorMessage: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        baseUrl: string;
        apiKey: string | null;
        isActive: boolean;
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
                description: string | null;
                slug: string;
                icon: string | null;
                color: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            stockId: string | null;
            cryptoAssetId: string | null;
            categoryId: string;
        })[];
    } & {
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
    })[]>;
    gainers(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    losers(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    detail(ticker: string): Promise<{
        comments: ({
            user: {
                profile: {
                    id: string;
                    userId: string;
                    createdAt: Date;
                    updatedAt: Date;
                    displayName: string;
                    username: string;
                    avatarUrl: string | null;
                    bio: string | null;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                isEmailVerified: boolean;
            };
            replies: ({
                user: {
                    profile: {
                        id: string;
                        userId: string;
                        createdAt: Date;
                        updatedAt: Date;
                        displayName: string;
                        username: string;
                        avatarUrl: string | null;
                        bio: string | null;
                    } | null;
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    passwordHash: string;
                    role: import(".prisma/client").$Enums.Role;
                    isEmailVerified: boolean;
                };
            } & {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                upvotes: number;
                isModerated: boolean;
                commentId: string;
            })[];
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
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
                baseUrl: string;
                isActive: boolean;
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
            imageUrl: string | null;
            slug: string;
            categoryId: string | null;
            content: string;
            sourceId: string | null;
            title: string;
            excerpt: string;
            source: string;
            sourceUrl: string;
            externalUrl: string | null;
            author: string | null;
            categoryLabel: string | null;
            publishedAt: Date;
            isInsight: boolean;
            trendingScore: number;
        })[];
        peers: {
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
        }[];
        prices: ({
            provider: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                baseUrl: string;
                apiKey: string | null;
                isActive: boolean;
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
            providerId: string | null;
            open: number;
            high: number;
            low: number;
            close: number;
        })[];
        assetCategories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                slug: string;
                icon: string | null;
                color: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            stockId: string | null;
            cryptoAssetId: string | null;
            categoryId: string;
        })[];
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
    }>;
}
