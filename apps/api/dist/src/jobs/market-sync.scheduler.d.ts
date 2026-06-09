import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
export declare class MarketSyncScheduler implements OnModuleInit {
    private readonly queue;
    constructor(queue: Queue);
    onModuleInit(): Promise<void>;
    scheduleStocks(): Promise<void>;
    scheduleCrypto(): Promise<void>;
    scheduleNews(): Promise<void>;
}
