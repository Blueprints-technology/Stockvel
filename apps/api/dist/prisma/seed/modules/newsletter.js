"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedNewsletter = seedNewsletter;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
async function seedNewsletter(tx) {
    logger_1.logger.info('Seeding newsletter data...');
    await tx.newsletterSubscriber.upsert({
        where: { email: 'demo@stockvel.ng' },
        update: { isActive: true, preferences: { topics: ['learn', 'research', 'markets'] } },
        create: {
            email: 'demo@stockvel.ng',
            preferences: { topics: ['learn', 'research', 'markets'] },
        },
    });
    await tx.newsletter.upsert({
        where: { id: 'weekly-market-wrap' },
        update: {
            subject: 'Weekly Market Wrap',
            content: 'A concise weekly round-up of NGX, crypto, and research highlights.',
            status: client_1.NewsletterStatus.SENT,
            sentAt: new Date(),
            recipientCount: 1,
            openCount: 1,
        },
        create: {
            id: 'weekly-market-wrap',
            subject: 'Weekly Market Wrap',
            content: 'A concise weekly round-up of NGX, crypto, and research highlights.',
            status: client_1.NewsletterStatus.SENT,
            sentAt: new Date(),
            recipientCount: 1,
            openCount: 1,
        },
    });
    logger_1.logger.progress('Newsletter records', 2);
}
//# sourceMappingURL=newsletter.js.map