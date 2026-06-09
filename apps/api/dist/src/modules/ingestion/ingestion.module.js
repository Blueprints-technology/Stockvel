"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const coingecko_provider_1 = require("./providers/coingecko.provider");
const news_provider_1 = require("./providers/news.provider");
const ngx_stock_provider_1 = require("./providers/ngx-stock.provider");
const ingestion_service_1 = require("./ingestion.service");
const realtime_module_1 = require("../realtime/realtime.module");
let IngestionModule = class IngestionModule {
};
exports.IngestionModule = IngestionModule;
exports.IngestionModule = IngestionModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, realtime_module_1.RealtimeModule],
        providers: [ngx_stock_provider_1.NgxStockProvider, coingecko_provider_1.CoinGeckoProvider, news_provider_1.NewsProvider, ingestion_service_1.IngestionService],
        exports: [ingestion_service_1.IngestionService],
    })
], IngestionModule);
//# sourceMappingURL=ingestion.module.js.map