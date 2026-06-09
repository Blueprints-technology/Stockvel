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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const xss_1 = __importDefault(require("xss"));
const prisma_service_1 = require("../../prisma/prisma.service");
const PROFANITY_WORDS = ['scam', 'fraudster', 'idiot'];
let CommentsService = class CommentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(assetType, assetSymbol) {
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
    async create(userId, dto) {
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
    async reply(userId, commentId, content) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
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
    async upvote(commentId) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { upvotes: { increment: 1 } },
        });
    }
    moderate(commentId, isModerated) {
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { isModerated },
        });
    }
    sanitize(content) {
        const cleaned = (0, xss_1.default)(content.trim());
        const hasProfanity = PROFANITY_WORDS.some((word) => cleaned.toLowerCase().includes(word));
        return {
            content: hasProfanity ? '[moderated] This post is awaiting moderator review.' : cleaned,
            isModerated: hasProfanity,
        };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map