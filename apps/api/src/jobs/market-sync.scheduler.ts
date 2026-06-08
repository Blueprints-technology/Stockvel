import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bullmq';

@Injectable()
export class MarketSyncScheduler implements OnModuleInit {
  constructor(@InjectQueue('market-sync') private readonly queue: Queue) {}

  async onModuleInit() {
    await Promise.all([
      this.queue.add('stocks-sync', {}, { removeOnComplete: 20, removeOnFail: 20 }),
      this.queue.add('crypto-sync', {}, { removeOnComplete: 20, removeOnFail: 20 }),
      this.queue.add('news-sync', {}, { removeOnComplete: 20, removeOnFail: 20 }),
    ]);
  }

  @Cron('*/15 * * * *')
  async scheduleStocks() {
    await this.queue.add('stocks-sync', {}, { removeOnComplete: 20, removeOnFail: 20 });
  }

  @Cron('*/5 * * * *')
  async scheduleCrypto() {
    await this.queue.add('crypto-sync', {}, { removeOnComplete: 20, removeOnFail: 20 });
  }

  @Cron('0 */1 * * *')
  async scheduleNews() {
    await this.queue.add('news-sync', {}, { removeOnComplete: 20, removeOnFail: 20 });
  }
}
