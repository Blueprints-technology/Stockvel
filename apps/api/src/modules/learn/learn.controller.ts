import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { LearnService } from './learn.service';

@ApiTags('Learn')
@Controller('learn')
export class LearnController {
  constructor(private readonly learnService: LearnService) {}

  @Public()
  @Get('articles')
  listArticles(@Query() query: QueryArticlesDto, @CurrentUser() user?: AuthenticatedUser) {
    return this.learnService.listArticles(query, user?.sub);
  }

  @Public()
  @Get('articles/featured')
  featured() {
    return this.learnService.featured();
  }

  @Public()
  @Get('categories')
  categories() {
    return this.learnService.categories();
  }

  @Public()
  @Get('articles/:slug')
  articleBySlug(@Param('slug') slug: string, @CurrentUser() user?: AuthenticatedUser) {
    return this.learnService.articleBySlug(slug, user?.sub);
  }

  @Public()
  @Get('articles/:slug/related')
  related(@Param('slug') slug: string) {
    return this.learnService.related(slug);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @Post('articles/:slug/bookmark')
  toggleBookmark(@Param('slug') slug: string, @CurrentUser() user: AuthenticatedUser) {
    return this.learnService.toggleBookmark(slug, user.sub);
  }
}
