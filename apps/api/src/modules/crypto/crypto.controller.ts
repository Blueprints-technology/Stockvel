import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { QueryCryptoDto } from './dto/query-crypto.dto';
import { CryptoService } from './crypto.service';

@ApiTags('Crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Public()
  @Get()
  list(@Query() query: QueryCryptoDto) {
    return this.cryptoService.list(query);
  }

  @Public()
  @Get('global')
  global() {
    return this.cryptoService.global();
  }

  @Public()
  @Get('trending')
  trending() {
    return this.cryptoService.trending();
  }

  @Public()
  @Get(':symbol')
  detail(@Param('symbol') symbol: string) {
    return this.cryptoService.detail(symbol);
  }
}
