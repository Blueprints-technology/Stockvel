import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto, response: Response): Promise<{
        accessToken: string;
        csrfToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                displayName: string;
                username: string;
                avatarUrl: string | null;
                bio: string | null;
            } | null;
            notifications: {
                message: string;
                type: import(".prisma/client").$Enums.NotificationType;
                id: string;
                createdAt: Date;
                userId: string;
                title: string;
                isRead: boolean;
            }[];
        };
    }>;
    login(dto: LoginDto, response: Response): Promise<{
        accessToken: string;
        csrfToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                displayName: string;
                username: string;
                avatarUrl: string | null;
                bio: string | null;
            } | null;
            notifications: {
                message: string;
                type: import(".prisma/client").$Enums.NotificationType;
                id: string;
                createdAt: Date;
                userId: string;
                title: string;
                isRead: boolean;
            }[];
        };
    }>;
    refresh(refreshToken: string | undefined, response: Response): Promise<{
        accessToken: string;
        csrfToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                displayName: string;
                username: string;
                avatarUrl: string | null;
                bio: string | null;
            } | null;
            notifications: {
                message: string;
                type: import(".prisma/client").$Enums.NotificationType;
                id: string;
                createdAt: Date;
                userId: string;
                title: string;
                isRead: boolean;
            }[];
        };
    }>;
    logout(userId: string, refreshToken: string | undefined, response: Response): Promise<{
        success: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string | undefined;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            displayName: string;
            username: string;
            avatarUrl: string | null;
            bio: string | null;
        } | null;
        notifications: {
            message: string;
            type: import(".prisma/client").$Enums.NotificationType;
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            isRead: boolean;
        }[];
    }>;
    private issueSession;
    private parseDurationToMs;
    private findMatchingToken;
}
