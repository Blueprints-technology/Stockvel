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
exports.CryptoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const query_crypto_dto_1 = require("./dto/query-crypto.dto");
const crypto_service_1 = require("./crypto.service");
let CryptoController = class CryptoController {
    cryptoService;
    constructor(cryptoService) {
        this.cryptoService = cryptoService;
    }
    list(query) {
        return this.cryptoService.list(query);
    }
    global() {
        return this.cryptoService.global();
    }
    trending() {
        return this.cryptoService.trending();
    }
    detail(symbol) {
        return this.cryptoService.detail(symbol);
    }
};
exports.CryptoController = CryptoController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_crypto_dto_1.QueryCryptoDto]),
    __metadata("design:returntype", void 0)
], CryptoController.prototype, "list", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('global'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CryptoController.prototype, "global", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('trending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CryptoController.prototype, "trending", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':symbol'),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CryptoController.prototype, "detail", null);
exports.CryptoController = CryptoController = __decorate([
    (0, swagger_1.ApiTags)('Crypto'),
    (0, common_1.Controller)('crypto'),
    __metadata("design:paramtypes", [crypto_service_1.CryptoService])
], CryptoController);
//# sourceMappingURL=crypto.controller.js.map