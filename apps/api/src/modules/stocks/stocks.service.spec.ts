import { StocksService } from './stocks.service';

describe('StocksService', () => {
  it('should be defined', () => {
    const service = new StocksService({} as any);
    expect(service).toBeDefined();
  });
});
