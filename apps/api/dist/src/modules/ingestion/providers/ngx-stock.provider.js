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
var NgxStockProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgxStockProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const playwright_1 = require("playwright");
let NgxStockProvider = NgxStockProvider_1 = class NgxStockProvider {
    configService;
    logger = new common_1.Logger(NgxStockProvider_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async fetchStocks() {
        const url = this.configService.get("integrations.ngxScrapeUrl") ??
            "https://ngxgroup.com/exchange/data/equities-price-list/";
        const browser = await playwright_1.chromium.launch({ headless: true });
        const page = await browser.newPage();
        try {
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
            await page.waitForSelector("table tbody tr", { timeout: 30_000 });
            const rows = await page.$$eval("table tbody tr", (elements) => elements.map((row) => {
                const cells = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent?.trim() ?? "");
                return {
                    ticker: cells[0] ?? "",
                    companyName: cells[0] ?? "",
                    previousClose: cells[1] ?? "0",
                    close: cells[5] ?? "0",
                    change: cells[6] ?? "0",
                    volume: cells[8] ?? "0",
                };
            }));
            return rows
                .filter((row) => row.ticker)
                .map((row) => {
                const currentPrice = this.toNumber(row.close);
                const dailyChange = this.toNumber(row.change);
                const previousClose = this.toNumber(row.previousClose) || currentPrice;
                const percentChange = previousClose
                    ? Number(((dailyChange / previousClose) * 100).toFixed(2))
                    : 0;
                return {
                    ticker: row.ticker.toUpperCase(),
                    companyName: row.companyName,
                    currentPrice,
                    dailyChange,
                    percentChange,
                    volume: this.toNumber(row.volume),
                    tradeDate: new Date(),
                };
            })
                .slice(0, 146);
        }
        catch (error) {
            this.logger.error("Failed to scrape NGX data", error);
            return [];
        }
        finally {
            await page.close();
            await browser.close();
        }
    }
    toNumber(value) {
        const sanitized = value.replace(/[^\d.-]/g, "");
        return sanitized ? Number(sanitized) : 0;
    }
};
exports.NgxStockProvider = NgxStockProvider;
exports.NgxStockProvider = NgxStockProvider = NgxStockProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NgxStockProvider);
//# sourceMappingURL=ngx-stock.provider.js.map