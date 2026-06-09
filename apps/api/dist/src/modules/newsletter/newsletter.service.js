"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let NewsletterService = class NewsletterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async subscribe(input) {
        const subscriber = await this.prisma.newsletterSubscriber.upsert({
            where: { email: input.email.toLowerCase() },
            update: {
                isActive: true,
                preferences: input.preferences ? { topics: input.preferences } : {},
                unsubscribedAt: null,
            },
            create: {
                email: input.email.toLowerCase(),
                preferences: input.preferences ? { topics: input.preferences } : {},
            },
        });
        return {
            success: true,
            message: 'Subscription saved successfully.',
            subscriber,
        };
    }
    async unsubscribe(input) {
        const existing = await this.prisma.newsletterSubscriber.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (!existing) {
            return {
                success: true,
                message: 'Email is already unsubscribed.',
            };
        }
        const subscriber = await this.prisma.newsletterSubscriber.update({
            where: { email: input.email.toLowerCase() },
            data: {
                isActive: false,
                unsubscribedAt: new Date(),
            },
        });
        return {
            success: true,
            message: 'You have been unsubscribed successfully.',
            subscriber,
        };
    }
    subscribers() {
        return this.prisma.newsletterSubscriber.findMany({
            orderBy: [{ isActive: 'desc' }, { subscribedAt: 'desc' }],
            take: 200,
        });
    }
    draft(body) {
        return this.prisma.newsletter.create({
            data: {
                subject: body.subject,
                content: body.content,
                status: body.scheduledFor ? client_1.NewsletterStatus.SCHEDULED : client_1.NewsletterStatus.DRAFT,
                scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
            },
        });
    }
    async send(body) {
        const recipientCount = await this.prisma.newsletterSubscriber.count({ where: { isActive: true } });
        return this.prisma.newsletter.create({
            data: {
                subject: body.subject,
                content: body.content,
                status: client_1.NewsletterStatus.SENT,
                sentAt: new Date(),
                recipientCount,
            },
        });
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map