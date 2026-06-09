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
exports.ReorderWatchlistDto = exports.WatchlistItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class WatchlistItemDto {
    assetType;
    assetSymbol;
    position;
}
exports.WatchlistItemDto = WatchlistItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AssetType }),
    (0, class_validator_1.IsEnum)(client_1.AssetType),
    __metadata("design:type", String)
], WatchlistItemDto.prototype, "assetType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WatchlistItemDto.prototype, "assetSymbol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], WatchlistItemDto.prototype, "position", void 0);
class ReorderWatchlistDto {
    items;
}
exports.ReorderWatchlistDto = ReorderWatchlistDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [WatchlistItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WatchlistItemDto),
    __metadata("design:type", Array)
], ReorderWatchlistDto.prototype, "items", void 0);
//# sourceMappingURL=update-watchlist.dto.js.map