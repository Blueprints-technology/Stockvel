import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import configuration from "./config/configuration";
import { validateEnvironment } from "./config/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { AdminModule } from "./modules/admin/admin.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { CryptoModule } from "./modules/crypto/crypto.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { IngestionModule } from "./modules/ingestion/ingestion.module";
import { JobsModule } from "./jobs/jobs.module";
import { HealthModule } from "./modules/health/health.module";
import { LearnModule } from "./modules/learn/learn.module";
import { NewsModule } from "./modules/news/news.module";
import { NewsletterModule } from "./modules/newsletter/newsletter.module";
import { PortfolioModule } from "./modules/portfolio/portfolio.module";
import { RealtimeModule } from "./modules/realtime/realtime.module";
import { ResearchModule } from "./modules/research/research.module";
import { SearchModule } from "./modules/search/search.module";
import { StocksModule } from "./modules/stocks/stocks.module";
import { WatchlistModule } from "./modules/watchlist/watchlist.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironment,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>("redis.url");
        if (!redisUrl) {
          console.warn("[BullMQ] REDIS_URL not set — background jobs disabled");
          return {
            connection: {
              host: "localhost",
              port: 6379,
            },
          } as any;
        }
        return {
          connection: {
            url: redisUrl,
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    StocksModule,
    CryptoModule,
    PortfolioModule,
    WatchlistModule,
    CommentsModule,
    NewsModule,
    CategoriesModule,
    LearnModule,
    ResearchModule,
    NewsletterModule,
    SearchModule,
    AdminModule,
    DashboardModule,
    IngestionModule,
    JobsModule,
    RealtimeModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    Reflector,
  ],
})
export class AppModule {}
