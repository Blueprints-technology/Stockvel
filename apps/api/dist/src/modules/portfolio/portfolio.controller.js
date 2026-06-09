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
exports.PortfolioController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const upsert_portfolio_asset_dto_1 = require("./dto/upsert-portfolio-asset.dto");
const portfolio_service_1 = require("./portfolio.service");
let PortfolioController = class PortfolioController {
    portfolioService;
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    getPortfolio(user) {
        return this.portfolioService.getPortfolio(user.sub);
    }
    addAsset(user, dto) {
        return this.portfolioService.addAsset(user.sub, dto);
    }
    removeAsset(user, id) {
        return this.portfolioService.removeAsset(user.sub, id);
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "getPortfolio", null);
__decorate([
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, common_1.Post)('add'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_portfolio_asset_dto_1.UpsertPortfolioAssetDto]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "addAsset", null);
__decorate([
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, common_1.Delete)('remove/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "removeAsset", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, swagger_1.ApiTags)('Portfolio'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('portfolio'),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService])
], PortfolioController);
//# sourceMappingURL=portfolio.controller.js.map