import { Request, Response } from 'express';
import { type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, response: Response): Promise<{
        accessToken: string;
        csrfToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            profile: {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                displayName: string;
                username: string;
                avatarUrl: string | null;
                bio: string | null;
            } | null;
            notifications: {
                id: string;
                userId: string;
                createdAt: Date;
                title: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
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
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                displayName: string;
                username: string;
                avatarUrl: string | null;
                bio: string | null;
            } | null;
            notifications: {
                id: string;
                userId: string;
                createdAt: Date;
                title: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            }[];
        };
    }>;
    refresh(request: Request, response: Response): Promise<{
        accessToken: string;
        csrfToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            profile: {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                displayName: string;
                username: string;
                avatarUrl: string | null;
                bio: string | null;
            } | null;
            notifications: {
                id: string;
                userId: string;
                createdAt: Date;
                title: string;
                type: import(".prisma/client").$Enums.NotificationType;
                message: string;
                isRead: boolean;
            }[];
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string | undefined;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
    logout(user: AuthenticatedUser, request: Request, response: Response): Promise<{
        success: boolean;
    }>;
    me(user: AuthenticatedUser): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        profile: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            username: string;
            avatarUrl: string | null;
            bio: string | null;
        } | null;
        notifications: {
            id: string;
            userId: string;
            createdAt: Date;
            title: string;
            type: import(".prisma/client").$Enums.NotificationType;
            message: string;
            isRead: boolean;
        }[];
    }>;
}
