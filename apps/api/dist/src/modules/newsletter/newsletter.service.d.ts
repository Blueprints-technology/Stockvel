import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';
export declare class NewsletterService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    subscribe(input: SubscribeNewsletterDto): Promise<{
        success: boolean;
        message: string;
        subscriber: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            preferences: import("@prisma/client/runtime/library").JsonValue;
            subscribedAt: Date;
            unsubscribedAt: Date | null;
        };
    }>;
    unsubscribe(input: UnsubscribeNewsletterDto): Promise<{
        success: boolean;
        message: string;
        subscriber?: undefined;
    } | {
        success: boolean;
        message: string;
        subscriber: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            preferences: import("@prisma/client/runtime/library").JsonValue;
            subscribedAt: Date;
            unsubscribedAt: Date | null;
        };
    }>;
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
    draft(body: CreateNewsletterDto): import(".prisma/client").Prisma.Prisma__NewsletterClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    send(body: CreateNewsletterDto): Promise<{
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
    }>;
}
