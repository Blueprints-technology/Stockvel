import { Prisma } from "@prisma/client";
export declare function seedArticles(tx: Prisma.TransactionClient, articleCategoryMap: Map<string, {
    id: string;
}>, demoUserId: string): Promise<void>;
