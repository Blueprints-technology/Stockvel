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
  const app = await NestFactory.create(AppModule, {
    cors: false,
  });

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
      transformOptions: {
        enableImplicitConversion: true,
      },
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
  await app.listen(configService.get<number>("app.port") ?? 4001);
}

bootstrap();
