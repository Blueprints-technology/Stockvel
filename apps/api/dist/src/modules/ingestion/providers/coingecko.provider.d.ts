import { ConfigService } from "@nestjs/config";
export declare class CoinGeckoProvider {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private get baseUrl();
    private get authHeaders();
    private httpsGet;
    private getWithRetry;
    fetchMarkets(): Promise<{
        global: any;
        trending: any;
        markets: any[];
    }>;
}
