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
exports.ResearchService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const paginate_util_1 = require("../../common/utils/paginate.util");
let ResearchService = class ResearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async reports(query) {
        const { page, limit, skip } = (0, paginate_util_1.getPagination)(query);
        const where = {
            status: client_1.ResearchReportStatus.PUBLISHED,
            AND: [query.type ? { type: query.type } : {}, query.year ? { reportYear: query.year } : {}],
        };
        const [items, total, years, latest, analysis, marketCoverage] = await Promise.all([
            this.prisma.researchReport.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ reportDate: 'desc' }],
            }),
            this.prisma.researchReport.count({ where }),
            this.prisma.researchReport.findMany({
                where: { status: client_1.ResearchReportStatus.PUBLISHED },
                distinct: ['reportYear'],
                select: { reportYear: true },
                orderBy: { reportYear: 'desc' },
            }),
            this.latest(),
            this.prisma.researchReport.findMany({
                where: { status: client_1.ResearchReportStatus.PUBLISHED, type: 'ANALYSIS' },
                take: 6,
                orderBy: { reportDate: 'desc' },
            }),
            this.prisma.researchReport.findMany({
                where: { status: client_1.ResearchReportStatus.PUBLISHED, type: 'MARKET_COVERAGE' },
                take: 6,
                orderBy: { reportDate: 'desc' },
            }),
        ]);
        return {
            items,
            years: years.map((entry) => entry.reportYear),
            latest,
            analysis,
            marketCoverage,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async report(slug) {
        const report = await this.prisma.researchReport.findUnique({ where: { slug } });
        if (!report || report.status !== client_1.ResearchReportStatus.PUBLISHED) {
            throw new common_1.NotFoundException('Research report not found');
        }
        return report;
    }
    podcasts() {
        return this.prisma.podcastEpisode.findMany({
            orderBy: { publishedAt: 'desc' },
        });
    }
    async podcast(slug) {
        const episode = await this.prisma.podcastEpisode.findUnique({ where: { slug } });
        if (!episode) {
            throw new common_1.NotFoundException('Podcast episode not found');
        }
        await this.prisma.podcastEpisode.update({
            where: { id: episode.id },
            data: { playCount: { increment: 1 } },
        });
        return { ...episode, playCount: episode.playCount + 1 };
    }
    async treasuries() {
        const latestEntries = await this.prisma.treasuryBill.findMany({
            orderBy: [{ date: 'desc' }, { tenor: 'asc' }],
            take: 12,
        });
        const grouped = new Map();
        latestEntries.forEach((entry) => {
            const current = grouped.get(entry.tenor) ?? [];
            current.push({ date: entry.date, rate: Number(entry.rate), source: entry.source });
            grouped.set(entry.tenor, current);
        });
        return Array.from(grouped.entries()).map(([tenor, series]) => ({
            tenor,
            latestRate: series[0]?.rate ?? 0,
            previousRate: series[1]?.rate ?? null,
            direction: series.length > 1 ? Math.sign(series[0].rate - series[1].rate) : 0,
            updatedAt: series[0]?.date ?? null,
            source: series[0]?.source ?? 'Sample Data',
            series: series.map((point) => ({ ...point, date: point.date.toISOString() })),
        }));
    }
    async trackDownload(slug) {
        const report = await this.prisma.researchReport.findUnique({ where: { slug } });
        if (!report) {
            throw new common_1.NotFoundException('Research report not found');
        }
        await this.prisma.researchReport.update({
            where: { id: report.id },
            data: { downloadCount: { increment: 1 } },
        });
        return { slug, downloadCount: report.downloadCount + 1 };
    }
    async latest() {
        const [reports, podcasts] = await Promise.all([
            this.prisma.researchReport.findMany({
                where: { status: client_1.ResearchReportStatus.PUBLISHED },
                take: 3,
                orderBy: { reportDate: 'desc' },
            }),
            this.prisma.podcastEpisode.findMany({
                take: 3,
                orderBy: { publishedAt: 'desc' },
            }),
        ]);
        return [
            ...reports.map((item) => ({ kind: 'report', date: item.reportDate, item })),
            ...podcasts.map((item) => ({ kind: 'podcast', date: item.publishedAt, item })),
        ].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
};
exports.ResearchService = ResearchService;
exports.ResearchService = ResearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResearchService);
//# sourceMappingURL=research.service.js.map