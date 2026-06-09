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
exports.StocksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const query_stocks_dto_1 = require("./dto/query-stocks.dto");
const stocks_service_1 = require("./stocks.service");
let StocksController = class StocksController {
    stocksService;
    constructor(stocksService) {
        this.stocksService = stocksService;
    }
    list(query) {
        return this.stocksService.list(query);
    }
    providers() {
        return this.stocksService.providers();
    }
    trending() {
        return this.stocksService.trending();
    }
    gainers() {
        return this.stocksService.gainers();
    }
    losers() {
        return this.stocksService.losers();
    }
    detail(ticker) {
        return this.stocksService.detail(ticker);
    }
};
exports.StocksController = StocksController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_stocks_dto_1.QueryStocksDto]),
    __metadata("design:returntype", void 0)
], StocksController.prototype, "list", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('providers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StocksController.prototype, "providers", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('trending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StocksController.prototype, "trending", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('gainers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StocksController.prototype, "gainers", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('losers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StocksController.prototype, "losers", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':ticker'),
    __param(0, (0, common_1.Param)('ticker')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StocksController.prototype, "detail", null);
exports.StocksController = StocksController = __decorate([
    (0, swagger_1.ApiTags)('Stocks'),
    (0, common_1.Controller)('stocks'),
    __metadata("design:paramtypes", [stocks_service_1.StocksService])
], StocksController);
//# sourceMappingURL=stocks.controller.js.map