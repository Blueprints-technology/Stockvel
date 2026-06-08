import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as https from "node:https";

@Injectable()
export class CoinGeckoProvider {
  private readonly logger = new Logger(CoinGeckoProvider.name);

  constructor(private readonly configService: ConfigService) {}

  private get baseUrl(): string {
    return this.configService.get<string>("integrations.coingeckoApiKey")
      ? "https://pro-api.coingecko.com/api/v3"
      : "https://api.coingecko.com/api/v3";
  }

  private get authHeaders(): Record<string, string> {
    const key = this.configService.get<string>("integrations.coingeckoApiKey");
    return key ? { "x-cg-pro-api-key": key } : {};
  }

  private httpsGet(url: string, timeoutMs = 15_000): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const req = https.get(
        url,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Stockvel/1.0",
            ...this.authHeaders,
          },
          family: 4,
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 400) {
            res.resume();
            return reject(new Error(`CoinGecko ${res.statusCode} for ${url}`));
          }

          const chunks: Buffer[] = [];
          res.on("data", (chunk: Buffer) => chunks.push(chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
            } catch (e) {
              reject(e);
            }
          });
          res.on("error", reject);
        },
      );

      req.setTimeout(timeoutMs, () => {
        req.destroy(
          new Error(`CoinGecko request timed out after ${timeoutMs}ms: ${url}`),
        );
      });
      req.on("error", reject);
    });
  }

  private async getWithRetry(url: string, retries = 3): Promise<unknown> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await this.httpsGet(url);
      } catch (err: any) {
        const isLast = attempt === retries;
        if (isLast) {
          this.logger.error(
            `CoinGecko failed after ${retries} attempts: ${url} — ${err.message}`,
          );
          throw err;
        }
        const backoff = attempt * 2_000;
        this.logger.warn(
          `CoinGecko attempt ${attempt}/${retries} failed, retrying in ${backoff}ms… (${err.message})`,
        );
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
    throw new Error("unreachable");
  }

  async fetchMarkets() {
    const [globalData, trendingData, marketsData] = (await Promise.all([
      this.getWithRetry(`${this.baseUrl}/global`),
      this.getWithRetry(`${this.baseUrl}/search/trending`),
      this.getWithRetry(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`,
      ),
    ])) as [any, any, any];

    return {
      global: globalData?.data,
      trending: trendingData?.coins ?? [],
      markets: Array.isArray(marketsData) ? marketsData : [],
    };
  }
}
