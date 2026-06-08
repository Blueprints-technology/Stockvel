import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IngestionService } from '../modules/ingestion/ingestion.service';

@Processor('market-sync')
export class MarketSyncProcessor extends WorkerHost {
  constructor(private readonly ingestionService: IngestionService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'stocks-sync':
        return this.ingestionService.syncStocks();
      case 'crypto-sync':
        return this.ingestionService.syncCrypto();
      case 'news-sync':
        return this.ingestionService.syncNews();
      default:
        return { ok: true };
    }
  }
}
