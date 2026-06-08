import { Injectable, NotFoundException } from '@nestjs/common';
import xss from 'xss';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

const PROFANITY_WORDS = ['scam', 'fraudster', 'idiot'];

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  list(assetType: 'STOCK' | 'CRYPTO', assetSymbol: string) {
    return this.prisma.comment.findMany({
      where: {
        assetType,
        assetSymbol: assetSymbol?.toUpperCase(),
        isModerated: false,
      },
      include: {
        user: { include: { profile: true } },
        replies: {
          where: { isModerated: false },
          include: { user: { include: { profile: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: string, dto: CreateCommentDto) {
    const moderation = this.sanitize(dto.content);
    return this.prisma.comment.create({
      data: {
        userId,
        assetType: dto.assetType,
        assetSymbol: dto.assetSymbol.toUpperCase(),
        content: moderation.content,
        isModerated: moderation.isModerated,
      },
    });
  }

  async reply(userId: string, commentId: string, content: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const moderation = this.sanitize(content);
    return this.prisma.reply.create({
      data: {
        userId,
        commentId,
        content: moderation.content,
        isModerated: moderation.isModerated,
      },
    });
  }

  async upvote(commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { upvotes: { increment: 1 } },
    });
  }

  moderate(commentId: string, isModerated: boolean) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { isModerated },
    });
  }

  private sanitize(content: string) {
    const cleaned = xss(content.trim());
    const hasProfanity = PROFANITY_WORDS.some((word) => cleaned.toLowerCase().includes(word));
    return {
      content: hasProfanity ? '[moderated] This post is awaiting moderator review.' : cleaned,
      isModerated: hasProfanity,
    };
  }
}
