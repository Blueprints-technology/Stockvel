declare const _default: () => {
    app: {
        port: number;
        nodeEnv: string;
        frontendUrl: string;
    };
    database: {
        url: string | undefined;
        directUrl: string | undefined;
    };
    redis: {
        url: string | undefined;
    };
    jwt: {
        accessSecret: string | undefined;
        refreshSecret: string | undefined;
        accessTtl: string;
        refreshTtl: string;
    };
    security: {
        cookieSecret: string | undefined;
        csrfSecret: string | undefined;
    };
    integrations: {
        coingeckoApiKey: string | undefined;
        ngxScrapeUrl: string;
        newsFeedUrl: string;
        cloudinaryCloudName: string | undefined;
        cloudinaryApiKey: string | undefined;
        cloudinaryApiSecret: string | undefined;
        sentryDsn: string | undefined;
        posthogApiKey: string | undefined;
        posthogHost: string | undefined;
    };
};
export default _default;
