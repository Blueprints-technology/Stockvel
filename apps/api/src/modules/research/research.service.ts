import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ResearchReportStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { getPagination } from '../../common/utils/paginate.util';
import { QueryReportsDto } from './dto/query-reports.dto';

@Injectable()
export class ResearchService {
  constructor(private readonly prisma: PrismaService) {}

  async reports(query: QueryReportsDto) {
    const { page, limit, skip } = getPagination(query);
    const where: Prisma.ResearchReportWhereInput = {
      status: ResearchReportStatus.PUBLISHED,
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
        where: { status: ResearchReportStatus.PUBLISHED },
        distinct: ['reportYear'],
        select: { reportYear: true },
        orderBy: { reportYear: 'desc' },
      }),
      this.latest(),
      this.prisma.researchReport.findMany({
        where: { status: ResearchReportStatus.PUBLISHED, type: 'ANALYSIS' },
        take: 6,
        orderBy: { reportDate: 'desc' },
      }),
      this.prisma.researchReport.findMany({
        where: { status: ResearchReportStatus.PUBLISHED, type: 'MARKET_COVERAGE' },
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

  async report(slug: string) {
    const report = await this.prisma.researchReport.findUnique({ where: { slug } });
    if (!report || report.status !== ResearchReportStatus.PUBLISHED) {
      throw new NotFoundException('Research report not found');
    }
    return report;
  }

  podcasts() {
    return this.prisma.podcastEpisode.findMany({
      orderBy: { publishedAt: 'desc' },
    });
  }

  async podcast(slug: string) {
    const episode = await this.prisma.podcastEpisode.findUnique({ where: { slug } });
    if (!episode) {
      throw new NotFoundException('Podcast episode not found');
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

    const grouped = new Map<string, Array<{ date: Date; rate: number; source: string }>>();
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

  async trackDownload(slug: string) {
    const report = await this.prisma.researchReport.findUnique({ where: { slug } });
    if (!report) {
      throw new NotFoundException('Research report not found');
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
        where: { status: ResearchReportStatus.PUBLISHED },
        take: 3,
        orderBy: { reportDate: 'desc' },
      }),
      this.prisma.podcastEpisode.findMany({
        take: 3,
        orderBy: { publishedAt: 'desc' },
      }),
    ]);

    return [
      ...reports.map((item) => ({ kind: 'report' as const, date: item.reportDate, item })),
      ...podcasts.map((item) => ({ kind: 'podcast' as const, date: item.publishedAt, item })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
