import { Prisma } from "@prisma/client";
export declare function seedWatchlist(tx: Prisma.TransactionClient, demoUser: {
    id: string;
}): Promise<void>;
