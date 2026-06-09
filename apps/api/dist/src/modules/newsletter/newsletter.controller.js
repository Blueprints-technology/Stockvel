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
exports.NewsletterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_newsletter_dto_1 = require("./dto/create-newsletter.dto");
const subscribe_newsletter_dto_1 = require("./dto/subscribe-newsletter.dto");
const unsubscribe_newsletter_dto_1 = require("./dto/unsubscribe-newsletter.dto");
const newsletter_service_1 = require("./newsletter.service");
let NewsletterController = class NewsletterController {
    newsletterService;
    constructor(newsletterService) {
        this.newsletterService = newsletterService;
    }
    subscribe(body) {
        return this.newsletterService.subscribe(body);
    }
    unsubscribe(body) {
        return this.newsletterService.unsubscribe(body);
    }
    subscribers() {
        return this.newsletterService.subscribers();
    }
    draft(body) {
        return this.newsletterService.draft(body);
    }
    send(body) {
        return this.newsletterService.send(body);
    }
};
exports.NewsletterController = NewsletterController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscribe_newsletter_dto_1.SubscribeNewsletterDto]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "subscribe", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('unsubscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unsubscribe_newsletter_dto_1.UnsubscribeNewsletterDto]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "unsubscribe", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('subscribers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "subscribers", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, csrf_guard_1.CsrfGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)('draft'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_newsletter_dto_1.CreateNewsletterDto]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "draft", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, csrf_guard_1.CsrfGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_newsletter_dto_1.CreateNewsletterDto]),
    __metadata("design:returntype", void 0)
], NewsletterController.prototype, "send", null);
exports.NewsletterController = NewsletterController = __decorate([
    (0, swagger_1.ApiTags)('Newsletter'),
    (0, common_1.Controller)('newsletter'),
    __metadata("design:paramtypes", [newsletter_service_1.NewsletterService])
], NewsletterController);
//# sourceMappingURL=newsletter.controller.js.map