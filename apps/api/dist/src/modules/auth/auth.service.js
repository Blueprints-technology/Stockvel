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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const csrf_util_1 = require("../../common/utils/csrf.util");
const password_util_1 = require("../../common/utils/password.util");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto, response) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
        if (existing) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const passwordHash = await (0, password_util_1.hashValue)(dto.password);
        const username = `${dto.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Math.floor(Math.random() * 10000)}`;
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                passwordHash,
                role: client_1.Role.USER,
                profile: {
                    create: {
                        displayName: dto.displayName,
                        username,
                    },
                },
                watchlists: {
                    create: {
                        name: 'My Watchlist',
                    },
                },
            },
            include: { profile: true },
        });
        return this.issueSession(user.id, user.email, user.role, response);
    }
    async login(dto, response) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
            include: { profile: true },
        });
        if (!user || !(await (0, password_util_1.compareValue)(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.issueSession(user.id, user.email, user.role, response);
    }
    async refresh(refreshToken, response) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token required');
        }
        const tokenRecords = await this.prisma.refreshToken.findMany({
            where: {
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            include: { user: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' },
        });
        const tokenRecord = await this.findMatchingToken(tokenRecords, refreshToken);
        if (!tokenRecord) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return this.issueSession(tokenRecord.user.id, tokenRecord.user.email, tokenRecord.user.role, response);
    }
    async logout(userId, refreshToken, response) {
        if (refreshToken) {
            const refreshTokens = await this.prisma.refreshToken.findMany({
                where: {
                    userId,
                    revokedAt: null,
                },
            });
            await Promise.all(refreshTokens.map(async (token) => {
                if (await (0, password_util_1.compareValue)(refreshToken, token.tokenHash)) {
                    await this.prisma.refreshToken.update({
                        where: { id: token.id },
                        data: { revokedAt: new Date() },
                    });
                }
            }));
        }
        response.clearCookie('refreshToken', { path: '/' });
        response.clearCookie('csrfToken', { path: '/' });
        return { success: true };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
            return { message: 'If the account exists, a reset token has been created.' };
        }
        const rawToken = (0, csrf_util_1.createCsrfToken)(email);
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash: await (0, password_util_1.hashValue)(rawToken),
                expiresAt: new Date(Date.now() + 1000 * 60 * 30),
            },
        });
        return {
            message: 'Reset token created. In production, deliver via email provider.',
            resetToken: this.configService.get('app.nodeEnv') === 'development' ? rawToken : undefined,
        };
    }
    async resetPassword(token, newPassword) {
        const records = await this.prisma.passwordResetToken.findMany({
            where: {
                usedAt: null,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
        const record = await this.findMatchingToken(records, token);
        if (!record) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: record.userId },
                data: { passwordHash: await (0, password_util_1.hashValue)(newPassword) },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: record.id },
                data: { usedAt: new Date() },
            }),
        ]);
        return { success: true };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                notifications: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: user.profile,
            notifications: user.notifications,
        };
    }
    async issueSession(userId, email, role, response) {
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId,
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { revokedAt: { not: null } },
                ],
            },
        });
        const accessToken = await this.jwtService.signAsync({ sub: userId, email, role });
        const refreshToken = (0, csrf_util_1.createCsrfToken)(`${userId}:${Date.now()}`);
        const csrfToken = (0, csrf_util_1.createCsrfToken)(`${email}:${Date.now()}`);
        const refreshTokenHash = await (0, password_util_1.hashValue)(refreshToken);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash: refreshTokenHash,
                expiresAt: new Date(Date.now() + this.parseDurationToMs(this.configService.get('jwt.refreshTtl') ?? '7d')),
            },
        });
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: this.configService.get('app.nodeEnv') === 'production',
            path: '/',
            maxAge: this.parseDurationToMs(this.configService.get('jwt.refreshTtl') ?? '7d'),
        });
        response.cookie('csrfToken', csrfToken, {
            httpOnly: false,
            sameSite: 'lax',
            secure: this.configService.get('app.nodeEnv') === 'production',
            path: '/',
            maxAge: this.parseDurationToMs(this.configService.get('jwt.refreshTtl') ?? '7d'),
        });
        const user = await this.getProfile(userId);
        return {
            accessToken,
            csrfToken,
            user,
        };
    }
    parseDurationToMs(value) {
        const match = value.match(/(\d+)([smhd])/);
        if (!match) {
            return 1000 * 60 * 60 * 24 * 7;
        }
        const amount = Number(match[1]);
        const unit = match[2];
        const map = {
            s: 1000,
            m: 60_000,
            h: 3_600_000,
            d: 86_400_000,
        };
        return amount * map[unit];
    }
    async findMatchingToken(records, rawToken) {
        for (const record of records) {
            if (await (0, password_util_1.compareValue)(rawToken, record.tokenHash)) {
                return record;
            }
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map