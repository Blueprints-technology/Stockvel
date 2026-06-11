import { Prisma } from "@prisma/client";
export declare function seedStocks(tx: Prisma.TransactionClient, sectorMap: Map<string, {
    id: string;
}>, primaryProviderId: string): Promise<{
    ticker: string;
    companyName: string;
    sector: string;
    currentPrice: number;
    dailyChange: number;
    percentChange: number;
    trendScore: number;
    sectorSlug: string;
    marketCap?: number | undefined;
    eps?: number | undefined;
    peRatio?: number | undefined;
    dividendYield?: number | undefined;
    volume?: number | undefined;
    week52High?: number | undefined;
    week52Low?: number | undefined;
}[]>;
