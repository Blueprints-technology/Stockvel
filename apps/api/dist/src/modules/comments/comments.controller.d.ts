import { type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
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
    create(user: AuthenticatedUser, dto: CreateCommentDto): Promise<{
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
    reply(user: AuthenticatedUser, commentId: string, dto: ReplyCommentDto): Promise<{
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
}
