import { PrismaService } from '../../prisma/prisma.service';
import { QueryCategoryAssetsDto } from './dto/query-category-assets.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<{
        assetCount: number;
        topMover: {
            id: string;
            ticker: string;
            companyName: string;
            currentPrice: number;
            dailyChange: number;
            percentChange: number;
        } | null;
        _count: {
            assetMappings: number;
        };
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        icon: string | null;
        color: string | null;
    }[]>;
    detail(slug: string): Promise<{
        stocks: {
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
        crypto: {
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
        }[];
        assetMappings: ({
            stock: {
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
            } | null;
            cryptoAsset: {
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
            } | null;
        } & {
            id: string;
            createdAt: Date;
            categoryId: string;
            stockId: string | null;
            cryptoAssetId: string | null;
        })[];
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        icon: string | null;
        color: string | null;
    }>;
    stocks(slug: string, query: QueryCategoryAssetsDto): Promise<{
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    crypto(slug: string, query: QueryCategoryAssetsDto): Promise<{
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
