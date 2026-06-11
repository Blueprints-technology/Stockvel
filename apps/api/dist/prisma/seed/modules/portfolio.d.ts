import { Prisma } from "@prisma/client";
export declare function seedPortfolio(tx: Prisma.TransactionClient, demoUser: {
    id: string;
}): Promise<void>;
