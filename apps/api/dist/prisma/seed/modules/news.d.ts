import { Prisma } from "@prisma/client";
export declare function seedNews(tx: Prisma.TransactionClient, newsCategoryMap: Map<string, {
    id: string;
}>, newsSourceMap: Map<string, {
    id: string;
}>): Promise<void>;
