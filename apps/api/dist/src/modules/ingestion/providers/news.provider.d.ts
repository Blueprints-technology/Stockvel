import { ConfigService } from '@nestjs/config';
export declare class NewsProvider {
    private readonly configService;
    private readonly parser;
    constructor(configService: ConfigService);
    fetchNews(): Promise<{
        title: string;
        excerpt: string;
        content: string;
        source: string;
        sourceUrl: string;
        publishedAt: Date;
        categories: string[];
    }[]>;
}
