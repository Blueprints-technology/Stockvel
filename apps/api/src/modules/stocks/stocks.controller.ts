import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { QueryStocksDto } from './dto/query-stocks.dto';
import { StocksService } from './stocks.service';

@ApiTags('Stocks')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Public()
  @Get()
  list(@Query() query: QueryStocksDto) {
    return this.stocksService.list(query);
  }

  @Public()
  @Get('providers')
  providers() {
    return this.stocksService.providers();
  }

  @Public()
  @Get('trending')
  trending() {
    return this.stocksService.trending();
  }

  @Public()
  @Get('gainers')
  gainers() {
    return this.stocksService.gainers();
  }

  @Public()
  @Get('losers')
  losers() {
    return this.stocksService.losers();
  }

  @Public()
  @Get(':ticker')
  detail(@Param('ticker') ticker: string) {
    return this.stocksService.detail(ticker);
  }
}
