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
exports.LearnController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const query_articles_dto_1 = require("./dto/query-articles.dto");
const learn_service_1 = require("./learn.service");
let LearnController = class LearnController {
    learnService;
    constructor(learnService) {
        this.learnService = learnService;
    }
    listArticles(query, user) {
        return this.learnService.listArticles(query, user?.sub);
    }
    featured() {
        return this.learnService.featured();
    }
    categories() {
        return this.learnService.categories();
    }
    articleBySlug(slug, user) {
        return this.learnService.articleBySlug(slug, user?.sub);
    }
    related(slug) {
        return this.learnService.related(slug);
    }
    toggleBookmark(slug, user) {
        return this.learnService.toggleBookmark(slug, user.sub);
    }
};
exports.LearnController = LearnController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('articles'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_articles_dto_1.QueryArticlesDto, Object]),
    __metadata("design:returntype", void 0)
], LearnController.prototype, "listArticles", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('articles/featured'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LearnController.prototype, "featured", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LearnController.prototype, "categories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('articles/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LearnController.prototype, "articleBySlug", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('articles/:slug/related'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LearnController.prototype, "related", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.Post)('articles/:slug/bookmark'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LearnController.prototype, "toggleBookmark", null);
exports.LearnController = LearnController = __decorate([
    (0, swagger_1.ApiTags)('Learn'),
    (0, common_1.Controller)('learn'),
    __metadata("design:paramtypes", [learn_service_1.LearnService])
], LearnController);
//# sourceMappingURL=learn.controller.js.map