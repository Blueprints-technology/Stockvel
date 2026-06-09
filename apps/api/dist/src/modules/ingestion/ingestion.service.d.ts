import { PrismaService } from "../../prisma/prisma.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { CoinGeckoProvider } from "./providers/coingecko.provider";
import { NewsProvider } from "./providers/news.provider";
import { NgxStockProvider } from "./providers/ngx-stock.provider";
export declare class IngestionService {
    private readonly prisma;
    private readonly ngxStockProvider;
    private readonly coinGeckoProvider;
    private readonly newsProvider;
    private readonly realtimeGateway;
    private readonly logger;
    constructor(prisma: PrismaService, ngxStockProvider: NgxStockProvider, coinGeckoProvider: CoinGeckoProvider, newsProvider: NewsProvider, realtimeGateway: RealtimeGateway);
    syncStocks(): Promise<{
        count: number;
    }>;
    syncCrypto(): Promise<{
        count: number;
        global: any;
    }>;
    syncNews(): Promise<{
        count: number;
    }>;
}
