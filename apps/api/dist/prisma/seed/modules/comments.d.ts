import { Prisma } from "@prisma/client";
export declare function seedComments(tx: Prisma.TransactionClient, demoUser: {
    id: string;
}, admin: {
    id: string;
}): Promise<void>;
