export default () => ({
  app: {
    port: Number(process.env.PORT ?? 4000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  },
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
    refreshTtl: process.env.JWT_REFRESH_TTL ?? "7d",
  },
  security: {
    cookieSecret: process.env.COOKIE_SECRET,
    csrfSecret: process.env.CSRF_SECRET,
  },
  integrations: {
    coingeckoApiKey: process.env.COINGECKO_API_KEY,
    ngxScrapeUrl:
      process.env.NGX_SCRAPE_URL ??
      "https://ngxgroup.com/exchange/data/equities-price-list/",
    newsFeedUrl: process.env.NEWS_FEED_URL ?? "https://nairametrics.com/feed/",
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    sentryDsn: process.env.SENTRY_DSN,
    posthogApiKey: process.env.POSTHOG_API_KEY,
    posthogHost: process.env.POSTHOG_HOST,
  },
});
