import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    overview(): Promise<{
        metrics: {
            users: number;
            comments: number;
            jobs: number;
            news: number;
            stocks: number;
            crypto: number;
            newsletters: number;
            subscribers: number;
            providers: number;
        };
        jobs: {
            id: string;
            status: string;
            message: string | null;
            jobName: string;
            startedAt: Date;
            completedAt: Date | null;
            metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    users(): import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    comments(moderated?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        replies: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            upvotes: number;
            isModerated: boolean;
            commentId: string;
        }[];
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
    })[]>;
    newsletters(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import(".prisma/client").$Enums.NewsletterStatus;
        subject: string;
        sentAt: Date | null;
        scheduledFor: Date | null;
        recipientCount: number;
        openCount: number;
    }[]>;
    subscribers(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        email: string;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        subscribedAt: Date;
        unsubscribedAt: Date | null;
    }[]>;
    providerStatus(): import(".prisma/client").Prisma.PrismaPromise<({
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
    moderateComment(body: {
        commentId: string;
        isModerated: boolean;
    }): import(".prisma/client").Prisma.Prisma__CommentClient<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        assetType: import(".prisma/client").$Enums.AssetType;
        assetSymbol: string;
        content: string;
        upvotes: number;
        isModerated: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    publishNews(body: Record<string, unknown>): import(".prisma/client").Prisma.Prisma__NewsClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
