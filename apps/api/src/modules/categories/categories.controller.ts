import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { QueryCategoryAssetsDto } from './dto/query-category-assets.dto';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  list() {
    return this.categoriesService.list();
  }

  @Public()
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.categoriesService.detail(slug);
  }

  @Public()
  @Get(':slug/stocks')
  stocks(@Param('slug') slug: string, @Query() query: QueryCategoryAssetsDto) {
    return this.categoriesService.stocks(slug, query);
  }

  @Public()
  @Get(':slug/crypto')
  crypto(@Param('slug') slug: string, @Query() query: QueryCategoryAssetsDto) {
    return this.categoriesService.crypto(slug, query);
  }
}
