import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { QueryNewsDto } from './dto/query-news.dto';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  list(@Query() query: QueryNewsDto) {
    return this.newsService.list(query);
  }

  @Public()
  @Get('sources')
  sources() {
    return this.newsService.sources();
  }

  @Public()
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.newsService.detail(slug);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.newsService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.newsService.update(id, body);
  }
}
