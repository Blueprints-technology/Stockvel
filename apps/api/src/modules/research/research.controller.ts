import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { QueryReportsDto } from './dto/query-reports.dto';
import { ResearchService } from './research.service';

@ApiTags('Research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Public()
  @Get('reports')
  reports(@Query() query: QueryReportsDto) {
    return this.researchService.reports(query);
  }

  @Public()
  @Get('reports/:slug')
  report(@Param('slug') slug: string) {
    return this.researchService.report(slug);
  }

  @Public()
  @Get('podcasts')
  podcasts() {
    return this.researchService.podcasts();
  }

  @Public()
  @Get('podcasts/:slug')
  podcast(@Param('slug') slug: string) {
    return this.researchService.podcast(slug);
  }

  @Public()
  @Get('treasuries')
  treasuries() {
    return this.researchService.treasuries();
  }

  @Public()
  @Get('latest')
  latest() {
    return this.researchService.latest();
  }

  @Public()
  @Post('reports/:slug/download')
  trackDownload(@Param('slug') slug: string) {
    return this.researchService.trackDownload(slug);
  }
}
