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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rss_parser_1 = __importDefault(require("rss-parser"));
let NewsProvider = class NewsProvider {
    configService;
    parser = new rss_parser_1.default();
    constructor(configService) {
        this.configService = configService;
    }
    async fetchNews() {
        const feedUrl = this.configService.get('integrations.newsFeedUrl') ?? 'https://nairametrics.com/feed/';
        const feed = await this.parser.parseURL(feedUrl);
        return (feed.items ?? []).slice(0, 25).map((item) => ({
            title: item.title ?? 'Untitled',
            excerpt: item.contentSnippet ?? item.content?.slice(0, 160) ?? 'Financial market update',
            content: item.content ?? item.contentSnippet ?? 'No content available',
            source: feed.title ?? 'Nairametrics',
            sourceUrl: item.link ?? feedUrl,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            categories: item.categories ?? [],
        }));
    }
};
exports.NewsProvider = NewsProvider;
exports.NewsProvider = NewsProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NewsProvider);
//# sourceMappingURL=news.provider.js.map