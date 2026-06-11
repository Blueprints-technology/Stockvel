import { NewsletterStatus, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

export async function seedNewsletter(tx: Prisma.TransactionClient) {
  logger.info('Seeding newsletter data...');

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
      status: NewsletterStatus.SENT,
      sentAt: new Date(),
      recipientCount: 1,
      openCount: 1,
    },
    create: {
      id: 'weekly-market-wrap',
      subject: 'Weekly Market Wrap',
      content: 'A concise weekly round-up of NGX, crypto, and research highlights.',
      status: NewsletterStatus.SENT,
      sentAt: new Date(),
      recipientCount: 1,
      openCount: 1,
    },
  });

  logger.progress('Newsletter records', 2);
}
