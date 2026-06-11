import { Prisma } from "@prisma/client";
export declare function seedUsers(tx: Prisma.TransactionClient): Promise<{
    admin: {
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
    } & {
        id: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    demoUser: {
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
    } & {
        id: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        isEmailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
