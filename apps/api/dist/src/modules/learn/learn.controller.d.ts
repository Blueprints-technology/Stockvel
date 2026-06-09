import { type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { LearnService } from './learn.service';
export declare class LearnController {
    private readonly learnService;
    constructor(learnService: LearnService);
    listArticles(query: QueryArticlesDto, user?: AuthenticatedUser): Promise<{
        items: {
            isBookmarked: boolean;
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                slug: string;
            } | null;
            bookmarks: {
                id: string;
                userId: string;
                createdAt: Date;
                articleId: string;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            categoryId: string | null;
            content: string;
            title: string;
            excerpt: string;
            author: string;
            publishedAt: Date;
            status: import(".prisma/client").$Enums.ArticleStatus;
            coverImage: string | null;
            authorAvatar: string | null;
            tags: string[];
            isFeatured: boolean;
            readTime: number;
            viewCount: number;
        }[];
        featured: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                slug: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            categoryId: string | null;
            content: string;
            title: string;
            excerpt: string;
            author: string;
            publishedAt: Date;
            status: import(".prisma/client").$Enums.ArticleStatus;
            coverImage: string | null;
            authorAvatar: string | null;
            tags: string[];
            isFeatured: boolean;
            readTime: number;
            viewCount: number;
        }) | null;
        trending: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                slug: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            categoryId: string | null;
            content: string;
            title: string;
            excerpt: string;
            author: string;
            publishedAt: Date;
            status: import(".prisma/client").$Enums.ArticleStatus;
            coverImage: string | null;
            authorAvatar: string | null;
            tags: string[];
            isFeatured: boolean;
            readTime: number;
            viewCount: number;
        })[];
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    featured(): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        categoryId: string | null;
        content: string;
        title: string;
        excerpt: string;
        author: string;
        publishedAt: Date;
        status: import(".prisma/client").$Enums.ArticleStatus;
        coverImage: string | null;
        authorAvatar: string | null;
        tags: string[];
        isFeatured: boolean;
        readTime: number;
        viewCount: number;
    })[]>;
    categories(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            articles: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        slug: string;
    })[]>;
    articleBySlug(slug: string, user?: AuthenticatedUser): Promise<{
        viewCount: number;
        isBookmarked: boolean;
        related: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                slug: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            categoryId: string | null;
            content: string;
            title: string;
            excerpt: string;
            author: string;
            publishedAt: Date;
            status: import(".prisma/client").$Enums.ArticleStatus;
            coverImage: string | null;
            authorAvatar: string | null;
            tags: string[];
            isFeatured: boolean;
            readTime: number;
            viewCount: number;
        })[];
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        } | null;
        bookmarks: {
            id: string;
            userId: string;
            createdAt: Date;
            articleId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        categoryId: string | null;
        content: string;
        title: string;
        excerpt: string;
        author: string;
        publishedAt: Date;
        status: import(".prisma/client").$Enums.ArticleStatus;
        coverImage: string | null;
        authorAvatar: string | null;
        tags: string[];
        isFeatured: boolean;
        readTime: number;
    }>;
    related(slug: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        categoryId: string | null;
        content: string;
        title: string;
        excerpt: string;
        author: string;
        publishedAt: Date;
        status: import(".prisma/client").$Enums.ArticleStatus;
        coverImage: string | null;
        authorAvatar: string | null;
        tags: string[];
        isFeatured: boolean;
        readTime: number;
        viewCount: number;
    })[]>;
    toggleBookmark(slug: string, user: AuthenticatedUser): Promise<{
        bookmarked: boolean;
    }>;
}
