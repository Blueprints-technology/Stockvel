import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const maxRetries = 5;
    let retries = maxRetries;

    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log("Database connected successfully");
        return;
      } catch (error: any) {
        retries--;
        this.logger.error(
          `Database connection failed (${maxRetries - retries}/${maxRetries}): ${error.message}`,
        );

        if (retries === 0) {
          this.logger.error(
            "Max retries reached. App will continue without database.",
          );
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log("Database disconnected");
    } catch (error: any) {
      this.logger.error(`Error disconnecting from database: ${error.message}`);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on("beforeExit", async () => {
      await app.close();
    });
  }
}
