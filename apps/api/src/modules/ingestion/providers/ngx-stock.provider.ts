import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { chromium } from "playwright";
import type {
  NormalizedStockQuote,
  StockProvider,
} from "./stock-provider.interface";

@Injectable()
export class NgxStockProvider implements StockProvider {
  private readonly logger = new Logger(NgxStockProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async fetchStocks(): Promise<NormalizedStockQuote[]> {
    const url =
      this.configService.get<string>("integrations.ngxScrapeUrl") ??
      "https://ngxgroup.com/exchange/data/equities-price-list/";
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForSelector("table tbody tr", { timeout: 30_000 });

      const rows = await page.$$eval("table tbody tr", (elements) =>
        elements.map((row) => {
          const cells = Array.from(row.querySelectorAll("td")).map(
            (cell) => cell.textContent?.trim() ?? "",
          );
          return {
            ticker: cells[0] ?? "",
            companyName: cells[0] ?? "",
            previousClose: cells[1] ?? "0",
            close: cells[5] ?? "0",
            change: cells[6] ?? "0",
            volume: cells[8] ?? "0",
          };
        }),
      );

      return rows
        .filter((row) => row.ticker)
        .map((row) => {
          const currentPrice = this.toNumber(row.close);
          const dailyChange = this.toNumber(row.change);
          const previousClose =
            this.toNumber(row.previousClose) || currentPrice;
          const percentChange = previousClose
            ? Number(((dailyChange / previousClose) * 100).toFixed(2))
            : 0;

          return {
            ticker: row.ticker.toUpperCase(),
            companyName: row.companyName,
            currentPrice,
            dailyChange,
            percentChange,
            volume: this.toNumber(row.volume),
            tradeDate: new Date(),
          } satisfies NormalizedStockQuote;
        })
        .slice(0, 146);
    } catch (error) {
      this.logger.error("Failed to scrape NGX data", error as Error);
      return [];
    } finally {
      await page.close();
      await browser.close();
    }
  }

  private toNumber(value: string) {
    const sanitized = value.replace(/[^\d.-]/g, "");
    return sanitized ? Number(sanitized) : 0;
  }
}
