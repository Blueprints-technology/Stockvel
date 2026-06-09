"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CoinGeckoProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinGeckoProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const https = __importStar(require("node:https"));
let CoinGeckoProvider = CoinGeckoProvider_1 = class CoinGeckoProvider {
    configService;
    logger = new common_1.Logger(CoinGeckoProvider_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    get baseUrl() {
        return this.configService.get("integrations.coingeckoApiKey")
            ? "https://pro-api.coingecko.com/api/v3"
            : "https://api.coingecko.com/api/v3";
    }
    get authHeaders() {
        const key = this.configService.get("integrations.coingeckoApiKey");
        return key ? { "x-cg-pro-api-key": key } : {};
    }
    httpsGet(url, timeoutMs = 15_000) {
        return new Promise((resolve, reject) => {
            const req = https.get(url, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "Stockvel/1.0",
                    ...this.authHeaders,
                },
                family: 4,
            }, (res) => {
                if (res.statusCode && res.statusCode >= 400) {
                    res.resume();
                    return reject(new Error(`CoinGecko ${res.statusCode} for ${url}`));
                }
                const chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
                res.on("error", reject);
            });
            req.setTimeout(timeoutMs, () => {
                req.destroy(new Error(`CoinGecko request timed out after ${timeoutMs}ms: ${url}`));
            });
            req.on("error", reject);
        });
    }
    async getWithRetry(url, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await this.httpsGet(url);
            }
            catch (err) {
                const isLast = attempt === retries;
                if (isLast) {
                    this.logger.error(`CoinGecko failed after ${retries} attempts: ${url} — ${err.message}`);
                    throw err;
                }
                const backoff = attempt * 2_000;
                this.logger.warn(`CoinGecko attempt ${attempt}/${retries} failed, retrying in ${backoff}ms… (${err.message})`);
                await new Promise((r) => setTimeout(r, backoff));
            }
        }
        throw new Error("unreachable");
    }
    async fetchMarkets() {
        const [globalData, trendingData, marketsData] = (await Promise.all([
            this.getWithRetry(`${this.baseUrl}/global`),
            this.getWithRetry(`${this.baseUrl}/search/trending`),
            this.getWithRetry(`${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`),
        ]));
        return {
            global: globalData?.data,
            trending: trendingData?.coins ?? [],
            markets: Array.isArray(marketsData) ? marketsData : [],
        };
    }
};
exports.CoinGeckoProvider = CoinGeckoProvider;
exports.CoinGeckoProvider = CoinGeckoProvider = CoinGeckoProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CoinGeckoProvider);
//# sourceMappingURL=coingecko.provider.js.map