import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryArticlesDto } from './dto/query-articles.dto';
export declare class LearnService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listArticles(query: QueryArticlesDto, userId?: string): Promise<{
        items: {
            isBookmarked: boolean;
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
            } | null;
            bookmarks: {
                id: string;
                createdAt: Date;
                userId: string;
                articleId: string;
            }[];
            status: import(".prisma/client").$Enums.ArticleStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            slug: string;
            title: string;
            excerpt: string;
            author: string;
            publishedAt: Date;
            categoryId: string | null;
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
                slug: string;
                description: string | null;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.ArticleStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            slug: string;
            title: string;
            excerpt: string;
            author: string;
            publishedAt: Date;
            categoryId: string | null;
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
                slug: string;
                description: string | null;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.ArticleStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            slug: string;
            title: string;
            excerpt: string;
            author: string;
            publishedAt: Date;
            categoryId: string | null;
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
            slug: string;
            description: string | null;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    categories(): Prisma.PrismaPromise<({
        _count: {
            articles: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    })[]>;
    featured(): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.ArticleStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        title: string;
        excerpt: string;
        author: string;
        publishedAt: Date;
        categoryId: string | null;
        coverImage: string | null;
        authorAvatar: string | null;
        tags: string[];
        isFeatured: boolean;
        readTime: number;
        viewCount: number;
    })[]>;
    articleBySlug(slug: string, userId?: string): Promise<{
        viewCount: number;
        isBookmarked: boolean;
        related: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.ArticleStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            slug: string;
            title: string;
            excerpt: string;
            author: string;
            publishedAt: Date;
            categoryId: string | null;
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
            slug: string;
            description: string | null;
        } | null;
        bookmarks: {
            id: string;
            createdAt: Date;
            userId: string;
            articleId: string;
        }[];
        status: import(".prisma/client").$Enums.ArticleStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        title: string;
        excerpt: string;
        author: string;
        publishedAt: Date;
        categoryId: string | null;
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
            slug: string;
            description: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.ArticleStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        title: string;
        excerpt: string;
        author: string;
        publishedAt: Date;
        categoryId: string | null;
        coverImage: string | null;
        authorAvatar: string | null;
        tags: string[];
        isFeatured: boolean;
        readTime: number;
        viewCount: number;
    })[]>;
    toggleBookmark(slug: string, userId: string): Promise<{
        bookmarked: boolean;
    }>;
}
