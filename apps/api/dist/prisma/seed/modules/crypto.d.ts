import { Prisma } from "@prisma/client";
export declare function seedCrypto(tx: Prisma.TransactionClient, sectorMap: Map<string, {
    id: string;
}>): Promise<{
    symbol: string;
    name: string;
    currentPrice: number;
    trendScore: number;
    coingeckoId: string;
    change24h: number;
    sectorSlug: string;
    imageUrl?: string | undefined;
    marketCap?: number | undefined;
    volume24h?: number | undefined;
    circulatingSupply?: number | undefined;
}[]>;
