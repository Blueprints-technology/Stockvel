import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoinGeckoProvider } from './providers/coingecko.provider';
import { NewsProvider } from './providers/news.provider';
import { NgxStockProvider } from './providers/ngx-stock.provider';
import { IngestionService } from './ingestion.service';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [ConfigModule, RealtimeModule],
  providers: [NgxStockProvider, CoinGeckoProvider, NewsProvider, IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
