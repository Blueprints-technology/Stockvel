import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IngestionService } from '../modules/ingestion/ingestion.service';
export declare class MarketSyncProcessor extends WorkerHost {
    private readonly ingestionService;
    constructor(ingestionService: IngestionService);
    process(job: Job): Promise<{
        count: number;
    } | {
        ok: boolean;
    }>;
}
