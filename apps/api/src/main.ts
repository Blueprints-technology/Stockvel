import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { setDefaultResultOrder } from "node:dns";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";

setDefaultResultOrder("ipv4first");

async function bootstrap() {
  console.log("=== BOOTSTRAP START ===");
  console.log("Raw process.env.PORT:", process.env.PORT);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
  console.log("REDIS_URL set:", !!process.env.REDIS_URL);

  const app = await NestFactory.create(AppModule, { cors: false });

  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);
  const frontendUrl =
    configService.get<string>("app.frontendUrl") ?? "http://localhost:3000";
  const cookieSecret =
    configService.get<string>("security.cookieSecret") ?? "change-me";

  app.getHttpAdapter().getInstance().set("trust proxy", 1);
  app.setGlobalPrefix("api/v1");
  app.use(cookieParser(cookieSecret));
  app.use(helmet());
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("StockNG API")
    .setDescription(
      "Nigerian stocks, crypto, portfolio, comments, and news platform API",
    )
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, swaggerDocument);

  await prismaService.enableShutdownHooks(app);

  const port = parseInt(process.env.PORT || "4000", 10);
  console.log(`Attempting to listen on port: ${port}`);

  await app.listen(port, "0.0.0.0");

  console.log(`=== SERVER RUNNING ON PORT ${port} ===`);
}

bootstrap().catch((error) => {
  console.error("=== BOOTSTRAP FAILED ===");
  console.error(error);
  process.exit(1);
});
