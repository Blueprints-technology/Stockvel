"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
exports.validateEnvironment = validateEnvironment;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.string().default("4000"),
    DATABASE_URL: zod_1.z.string().min(1),
    DIRECT_URL: zod_1.z.string().optional(),
    REDIS_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16),
    JWT_ACCESS_TTL: zod_1.z.string().default("15m"),
    JWT_REFRESH_TTL: zod_1.z.string().default("7d"),
    COOKIE_SECRET: zod_1.z.string().min(16),
    CSRF_SECRET: zod_1.z.string().min(16),
    FRONTEND_URL: zod_1.z.string().url().default("http://localhost:3000"),
    COINGECKO_API_KEY: zod_1.z.string().optional(),
    NGX_SCRAPE_URL: zod_1.z.string().url().optional(),
    NEWS_FEED_URL: zod_1.z.string().url().optional(),
    SENTRY_DSN: zod_1.z.string().optional(),
    POSTHOG_API_KEY: zod_1.z.string().optional(),
    POSTHOG_HOST: zod_1.z.string().optional(),
});
function validateEnvironment(config) {
    const result = exports.envSchema.safeParse(config);
    if (!result.success) {
        throw new Error(`Invalid environment configuration: ${result.error.message}`);
    }
    return result.data;
}
//# sourceMappingURL=env.validation.js.map