import { Prisma } from "@prisma/client";
export declare function seedProviderLogs(tx: Prisma.TransactionClient, providers: Array<{
    id: string;
    slug: string;
}>): Promise<void>;
