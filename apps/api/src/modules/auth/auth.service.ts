import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role } from '@prisma/client';
import { Response } from 'express';
import { createCsrfToken } from '../../common/utils/csrf.util';
import { compareValue, hashValue } from '../../common/utils/password.util';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto, response: Response) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await hashValue(dto.password);
    const username = `${dto.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Math.floor(Math.random() * 10000)}`;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        role: Role.USER,
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

  async login(dto: LoginDto, response: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user || !(await compareValue(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueSession(user.id, user.email, user.role, response);
  }

  async refresh(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
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
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueSession(tokenRecord.user.id, tokenRecord.user.email, tokenRecord.user.role, response);
  }

  async logout(userId: string, refreshToken: string | undefined, response: Response) {
    if (refreshToken) {
      const refreshTokens = await this.prisma.refreshToken.findMany({
        where: {
          userId,
          revokedAt: null,
        },
      });

      await Promise.all(
        refreshTokens.map(async (token) => {
          if (await compareValue(refreshToken, token.tokenHash)) {
            await this.prisma.refreshToken.update({
              where: { id: token.id },
              data: { revokedAt: new Date() },
            });
          }
        }),
      );
    }

    response.clearCookie('refreshToken', { path: '/' });
    response.clearCookie('csrfToken', { path: '/' });

    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return { message: 'If the account exists, a reset token has been created.' };
    }

    const rawToken = createCsrfToken(email);
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: await hashValue(rawToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    return {
      message: 'Reset token created. In production, deliver via email provider.',
      resetToken: this.configService.get<string>('app.nodeEnv') === 'development' ? rawToken : undefined,
    };
  }

  async resetPassword(token: string, newPassword: string) {
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
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash: await hashValue(newPassword) },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ] as Prisma.PrismaPromise<unknown>[]);

    return { success: true };
  }

  async getProfile(userId: string) {
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
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      notifications: user.notifications,
    };
  }

  private async issueSession(userId: string, email: string, role: Role, response: Response) {
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
    const refreshToken = createCsrfToken(`${userId}:${Date.now()}`);
    const csrfToken = createCsrfToken(`${email}:${Date.now()}`);
    const refreshTokenHash = await hashValue(refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + this.parseDurationToMs(this.configService.get<string>('jwt.refreshTtl') ?? '7d')),
      },
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.configService.get<string>('app.nodeEnv') === 'production',
      path: '/',
      maxAge: this.parseDurationToMs(this.configService.get<string>('jwt.refreshTtl') ?? '7d'),
    });

    response.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: this.configService.get<string>('app.nodeEnv') === 'production',
      path: '/',
      maxAge: this.parseDurationToMs(this.configService.get<string>('jwt.refreshTtl') ?? '7d'),
    });

    const user = await this.getProfile(userId);

    return {
      accessToken,
      csrfToken,
      user,
    };
  }

  private parseDurationToMs(value: string) {
    const match = value.match(/(\d+)([smhd])/);
    if (!match) {
      return 1000 * 60 * 60 * 24 * 7;
    }
    const amount = Number(match[1]);
    const unit = match[2];
    const map: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return amount * map[unit];
  }

  private async findMatchingToken<T extends { tokenHash: string }>(records: T[], rawToken: string) {
    for (const record of records) {
      if (await compareValue(rawToken, record.tokenHash)) {
        return record;
      }
    }
    return null;
  }
}
