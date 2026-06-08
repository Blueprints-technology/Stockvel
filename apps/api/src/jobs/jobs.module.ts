import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { IngestionModule } from '../modules/ingestion/ingestion.module';
import { MarketSyncProcessor } from './market-sync.processor';
import { MarketSyncScheduler } from './market-sync.scheduler';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'market-sync',
    }),
    IngestionModule,
  ],
  providers: [MarketSyncProcessor, MarketSyncScheduler],
})
export class JobsModule {}
