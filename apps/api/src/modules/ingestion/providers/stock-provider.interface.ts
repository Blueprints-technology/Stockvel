export interface NormalizedStockQuote {
  ticker: string;
  companyName: string;
  sector?: string;
  currentPrice: number;
  dailyChange: number;
  percentChange: number;
  volume?: number;
  marketCap?: number;
  tradeDate?: Date;
}

export interface StockProvider {
  fetchStocks(): Promise<NormalizedStockQuote[]>;
}
