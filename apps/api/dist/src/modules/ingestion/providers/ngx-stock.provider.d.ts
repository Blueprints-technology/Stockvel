import { ConfigService } from "@nestjs/config";
import type { NormalizedStockQuote, StockProvider } from "./stock-provider.interface";
export declare class NgxStockProvider implements StockProvider {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    fetchStocks(): Promise<NormalizedStockQuote[]>;
    private toNumber;
}
