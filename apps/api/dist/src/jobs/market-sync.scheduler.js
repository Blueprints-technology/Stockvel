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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketSyncScheduler = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bullmq_2 = require("bullmq");
let MarketSyncScheduler = class MarketSyncScheduler {
    queue;
    constructor(queue) {
        this.queue = queue;
    }
    async onModuleInit() {
        await Promise.all([
            this.queue.add('stocks-sync', {}, { removeOnComplete: 20, removeOnFail: 20 }),
            this.queue.add('crypto-sync', {}, { removeOnComplete: 20, removeOnFail: 20 }),
            this.queue.add('news-sync', {}, { removeOnComplete: 20, removeOnFail: 20 }),
        ]);
    }
    async scheduleStocks() {
        await this.queue.add('stocks-sync', {}, { removeOnComplete: 20, removeOnFail: 20 });
    }
    async scheduleCrypto() {
        await this.queue.add('crypto-sync', {}, { removeOnComplete: 20, removeOnFail: 20 });
    }
    async scheduleNews() {
        await this.queue.add('news-sync', {}, { removeOnComplete: 20, removeOnFail: 20 });
    }
};
exports.MarketSyncScheduler = MarketSyncScheduler;
__decorate([
    (0, schedule_1.Cron)('*/15 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketSyncScheduler.prototype, "scheduleStocks", null);
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketSyncScheduler.prototype, "scheduleCrypto", null);
__decorate([
    (0, schedule_1.Cron)('0 */1 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketSyncScheduler.prototype, "scheduleNews", null);
exports.MarketSyncScheduler = MarketSyncScheduler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('market-sync')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], MarketSyncScheduler);
//# sourceMappingURL=market-sync.scheduler.js.map