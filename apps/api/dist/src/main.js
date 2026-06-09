"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const node_dns_1 = require("node:dns");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
(0, node_dns_1.setDefaultResultOrder)("ipv4first");
async function bootstrap() {
    console.log("=== BOOTSTRAP START ===");
    console.log("PORT env:", process.env.PORT);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
    console.log("REDIS_URL set:", !!process.env.REDIS_URL);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: false,
    });
    const configService = app.get(config_1.ConfigService);
    const prismaService = app.get(prisma_service_1.PrismaService);
    const frontendUrl = configService.get("app.frontendUrl") ?? "http://localhost:3000";
    const cookieSecret = configService.get("security.cookieSecret") ?? "change-me";
    app.getHttpAdapter().getInstance().set("trust proxy", 1);
    app.setGlobalPrefix("api/v1");
    app.use((0, cookie_parser_1.default)(cookieSecret));
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: false,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("StockNG API")
        .setDescription("Nigerian stocks, crypto, portfolio, comments, and news platform API")
        .setVersion("1.0.0")
        .addBearerAuth()
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("api/docs", app, swaggerDocument);
    await prismaService.enableShutdownHooks(app);
    const port = configService.get("app.port") ?? 4000;
    console.log(`Attempting to listen on port: ${port}`);
    await app.listen(port);
    console.log(`=== SERVER RUNNING ON PORT ${port} ===`);
}
bootstrap().catch((error) => {
    console.error("=== BOOTSTRAP FAILED ===");
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map