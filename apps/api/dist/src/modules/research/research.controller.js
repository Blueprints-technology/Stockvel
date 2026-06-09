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
exports.ResearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const query_reports_dto_1 = require("./dto/query-reports.dto");
const research_service_1 = require("./research.service");
let ResearchController = class ResearchController {
    researchService;
    constructor(researchService) {
        this.researchService = researchService;
    }
    reports(query) {
        return this.researchService.reports(query);
    }
    report(slug) {
        return this.researchService.report(slug);
    }
    podcasts() {
        return this.researchService.podcasts();
    }
    podcast(slug) {
        return this.researchService.podcast(slug);
    }
    treasuries() {
        return this.researchService.treasuries();
    }
    latest() {
        return this.researchService.latest();
    }
    trackDownload(slug) {
        return this.researchService.trackDownload(slug);
    }
};
exports.ResearchController = ResearchController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_reports_dto_1.QueryReportsDto]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "reports", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('reports/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "report", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('podcasts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "podcasts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('podcasts/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "podcast", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('treasuries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "treasuries", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('latest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "latest", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reports/:slug/download'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResearchController.prototype, "trackDownload", null);
exports.ResearchController = ResearchController = __decorate([
    (0, swagger_1.ApiTags)('Research'),
    (0, common_1.Controller)('research'),
    __metadata("design:paramtypes", [research_service_1.ResearchService])
], ResearchController);
//# sourceMappingURL=research.controller.js.map