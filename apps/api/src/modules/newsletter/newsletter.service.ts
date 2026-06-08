import { Injectable } from '@nestjs/common';
import { NewsletterStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(input: SubscribeNewsletterDto) {
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

  async unsubscribe(input: UnsubscribeNewsletterDto) {
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

  draft(body: CreateNewsletterDto) {
    return this.prisma.newsletter.create({
      data: {
        subject: body.subject,
        content: body.content,
        status: body.scheduledFor ? NewsletterStatus.SCHEDULED : NewsletterStatus.DRAFT,
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
      },
    });
  }

  async send(body: CreateNewsletterDto) {
    const recipientCount = await this.prisma.newsletterSubscriber.count({ where: { isActive: true } });

    return this.prisma.newsletter.create({
      data: {
        subject: body.subject,
        content: body.content,
        status: NewsletterStatus.SENT,
        sentAt: new Date(),
        recipientCount,
      },
    });
  }
}
