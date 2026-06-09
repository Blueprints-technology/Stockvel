import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryCryptoDto } from './dto/query-crypto.dto';
export declare class CryptoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: QueryCryptoDto): Promise<{
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
        })[];
        categories: string[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    detail(symbol: string): Promise<{
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
                config: Prisma.JsonValue;
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
    }>;
    global(): Promise<{
        activeAssets: number;
        totalMarketCap: number;
        totalVolume24h: number;
    }>;
    trending(): Prisma.PrismaPromise<{
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
    }[]>;
}
