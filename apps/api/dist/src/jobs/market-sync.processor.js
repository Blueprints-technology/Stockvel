"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketSyncProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const ingestion_service_1 = require("../modules/ingestion/ingestion.service");
let MarketSyncProcessor = class MarketSyncProcessor extends bullmq_1.WorkerHost {
    ingestionService;
    constructor(ingestionService) {
        super();
        this.ingestionService = ingestionService;
    }
    async process(job) {
        switch (job.name) {
            case 'stocks-sync':
                return this.ingestionService.syncStocks();
            case 'crypto-sync':
                return this.ingestionService.syncCrypto();
            case 'news-sync':
                return this.ingestionService.syncNews();
            default:
                return { ok: true };
        }
    }
};
exports.MarketSyncProcessor = MarketSyncProcessor;
exports.MarketSyncProcessor = MarketSyncProcessor = __decorate([
    (0, bullmq_1.Processor)('market-sync'),
    __metadata("design:paramtypes", [ingestion_service_1.IngestionService])
], MarketSyncProcessor);
//# sourceMappingURL=market-sync.processor.js.map