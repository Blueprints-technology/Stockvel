"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const configuration_1 = __importDefault(require("./config/configuration"));
const env_validation_1 = require("./config/env.validation");
const prisma_module_1 = require("./prisma/prisma.module");
const admin_module_1 = require("./modules/admin/admin.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const categories_module_1 = require("./modules/categories/categories.module");
const comments_module_1 = require("./modules/comments/comments.module");
const crypto_module_1 = require("./modules/crypto/crypto.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const ingestion_module_1 = require("./modules/ingestion/ingestion.module");
const jobs_module_1 = require("./jobs/jobs.module");
const health_module_1 = require("./modules/health/health.module");
const learn_module_1 = require("./modules/learn/learn.module");
const news_module_1 = require("./modules/news/news.module");
const newsletter_module_1 = require("./modules/newsletter/newsletter.module");
const portfolio_module_1 = require("./modules/portfolio/portfolio.module");
const realtime_module_1 = require("./modules/realtime/realtime.module");
const research_module_1 = require("./modules/research/research.module");
const search_module_1 = require("./modules/search/search.module");
const stocks_module_1 = require("./modules/stocks/stocks.module");
const watchlist_module_1 = require("./modules/watchlist/watchlist.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validate: env_validation_1.validateEnvironment,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60_000,
                    limit: 120,
                },
            ]),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    connection: {
                        url: configService.get('redis.url'),
                    },
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            stocks_module_1.StocksModule,
            crypto_module_1.CryptoModule,
            portfolio_module_1.PortfolioModule,
            watchlist_module_1.WatchlistModule,
            comments_module_1.CommentsModule,
            news_module_1.NewsModule,
            categories_module_1.CategoriesModule,
            learn_module_1.LearnModule,
            research_module_1.ResearchModule,
            newsletter_module_1.NewsletterModule,
            search_module_1.SearchModule,
            admin_module_1.AdminModule,
            dashboard_module_1.DashboardModule,
            ingestion_module_1.IngestionModule,
            jobs_module_1.JobsModule,
            realtime_module_1.RealtimeModule,
            health_module_1.HealthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            core_1.Reflector,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map