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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const reply_comment_dto_1 = require("./dto/reply-comment.dto");
const comments_service_1 = require("./comments.service");
let CommentsController = class CommentsController {
    commentsService;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    list(assetType, assetSymbol) {
        return this.commentsService.list(assetType, assetSymbol);
    }
    create(user, dto) {
        return this.commentsService.create(user.sub, dto);
    }
    reply(user, commentId, dto) {
        return this.commentsService.reply(user.sub, commentId, dto.content);
    }
    upvote(commentId) {
        return this.commentsService.upvote(commentId);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('assetType')),
    __param(1, (0, common_1.Query)('assetSymbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('create'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('reply/:commentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reply_comment_dto_1.ReplyCommentDto]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "reply", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('upvote/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "upvote", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map