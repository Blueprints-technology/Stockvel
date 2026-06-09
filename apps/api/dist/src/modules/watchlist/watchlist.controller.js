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
exports.WatchlistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const update_watchlist_dto_1 = require("./dto/update-watchlist.dto");
const watchlist_service_1 = require("./watchlist.service");
let WatchlistController = class WatchlistController {
    watchlistService;
    constructor(watchlistService) {
        this.watchlistService = watchlistService;
    }
    getWatchlist(user) {
        return this.watchlistService.getWatchlist(user.sub);
    }
    addItem(user, dto) {
        return this.watchlistService.addItem(user.sub, dto);
    }
    reorder(user, dto) {
        return this.watchlistService.reorder(user.sub, dto);
    }
    removeItem(user, dto) {
        return this.watchlistService.removeItem(user.sub, dto);
    }
};
exports.WatchlistController = WatchlistController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "getWatchlist", null);
__decorate([
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_watchlist_dto_1.WatchlistItemDto]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "addItem", null);
__decorate([
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, common_1.Post)('reorder'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_watchlist_dto_1.ReorderWatchlistDto]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "reorder", null);
__decorate([
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, common_1.Delete)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_watchlist_dto_1.WatchlistItemDto]),
    __metadata("design:returntype", void 0)
], WatchlistController.prototype, "removeItem", null);
exports.WatchlistController = WatchlistController = __decorate([
    (0, swagger_1.ApiTags)('Watchlist'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('watchlist'),
    __metadata("design:paramtypes", [watchlist_service_1.WatchlistService])
], WatchlistController);
//# sourceMappingURL=watchlist.controller.js.map