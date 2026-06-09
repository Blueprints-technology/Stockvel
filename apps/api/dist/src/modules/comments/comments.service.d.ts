import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(assetType: 'STOCK' | 'CRYPTO', assetSymbol: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    create(userId: string, dto: CreateCommentDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        assetType: import(".prisma/client").$Enums.AssetType;
        assetSymbol: string;
        content: string;
        upvotes: number;
        isModerated: boolean;
    }>;
    reply(userId: string, commentId: string, content: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        upvotes: number;
        isModerated: boolean;
        commentId: string;
    }>;
    upvote(commentId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        assetType: import(".prisma/client").$Enums.AssetType;
        assetSymbol: string;
        content: string;
        upvotes: number;
        isModerated: boolean;
    }>;
    moderate(commentId: string, isModerated: boolean): import(".prisma/client").Prisma.Prisma__CommentClient<{
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
    private sanitize;
}
