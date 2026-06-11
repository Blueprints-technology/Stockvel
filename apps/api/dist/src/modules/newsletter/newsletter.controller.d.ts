import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';
import { NewsletterService } from './newsletter.service';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(body: SubscribeNewsletterDto): Promise<{
        success: boolean;
        message: string;
        subscriber: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            preferences: import("@prisma/client/runtime/library").JsonValue;
            subscribedAt: Date;
            unsubscribedAt: Date | null;
        };
    }>;
    unsubscribe(body: UnsubscribeNewsletterDto): Promise<{
        success: boolean;
        message: string;
        subscriber?: undefined;
    } | {
        success: boolean;
        message: string;
        subscriber: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            preferences: import("@prisma/client/runtime/library").JsonValue;
            subscribedAt: Date;
            unsubscribedAt: Date | null;
        };
    }>;
    subscribers(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        subscribedAt: Date;
        unsubscribedAt: Date | null;
    }[]>;
    draft(body: CreateNewsletterDto): import(".prisma/client").Prisma.Prisma__NewsletterClient<{
        status: import(".prisma/client").$Enums.NewsletterStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        subject: string;
        sentAt: Date | null;
        scheduledFor: Date | null;
        recipientCount: number;
        openCount: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    send(body: CreateNewsletterDto): Promise<{
        status: import(".prisma/client").$Enums.NewsletterStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        subject: string;
        sentAt: Date | null;
        scheduledFor: Date | null;
        recipientCount: number;
        openCount: number;
    }>;
}
