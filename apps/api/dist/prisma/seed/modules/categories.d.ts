import { Prisma } from "@prisma/client";
export declare function seedCategories(tx: Prisma.TransactionClient): Promise<{
    newsCategories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }[];
    sectorCategories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        icon: string | null;
        color: string | null;
    }[];
    articleCategories: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }[];
    newsSources: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        baseUrl: string;
        config: Prisma.JsonValue;
        lastFetchedAt: Date | null;
        logoUrl: string | null;
        fetchStrategy: import(".prisma/client").$Enums.FetchStrategy;
    }[];
    stockProviders: {
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
        config: Prisma.JsonValue;
        lastFetchedAt: Date | null;
    }[];
    sectorMap: Map<string, {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        icon: string | null;
        color: string | null;
    }>;
    newsCategoryMap: Map<string, {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }>;
    articleCategoryMap: Map<string, {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }>;
    newsSourceMap: Map<string, {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        baseUrl: string;
        config: Prisma.JsonValue;
        lastFetchedAt: Date | null;
        logoUrl: string | null;
        fetchStrategy: import(".prisma/client").$Enums.FetchStrategy;
    }>;
    primaryProvider: {
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
        config: Prisma.JsonValue;
        lastFetchedAt: Date | null;
    };
}>;
