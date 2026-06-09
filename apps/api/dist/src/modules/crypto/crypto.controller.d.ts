import { QueryCryptoDto } from './dto/query-crypto.dto';
import { CryptoService } from './crypto.service';
export declare class CryptoController {
    private readonly cryptoService;
    constructor(cryptoService: CryptoService);
    list(query: QueryCryptoDto): Promise<{
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
        })[];
        categories: string[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    global(): Promise<{
        activeAssets: number;
        totalMarketCap: number;
        totalVolume24h: number;
    }>;
    trending(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    detail(symbol: string): Promise<{
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
        prices: {
            id: string;
            createdAt: Date;
            volume: number | null;
            cryptoAssetId: string;
            date: Date;
            open: number;
            high: number;
            low: number;
            close: number;
        }[];
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
    }>;
}
