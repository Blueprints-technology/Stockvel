import { Prisma } from "@prisma/client";
import rawTreasuryData from "../data/treasury.json";
import { TreasurySchema } from "../utils/validate";
import { logger } from "../utils/logger";

export async function seedTreasury(tx: Prisma.TransactionClient) {
  logger.info("Seeding treasury bill data...");

  const series = rawTreasuryData.map((t) => TreasurySchema.parse(t));
  let count = 0;

  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    for (const entry of series) {
      const date = new Date();
      date.setDate(date.getDate() - weekOffset * 7);
      date.setHours(0, 0, 0, 0);

      try {
        await tx.treasuryBill.create({
          data: {
            tenor: entry.tenor,
            rate: entry.rate,
            date,
            source: entry.source,
          },
        });
        count++;
      } catch (err: unknown) {
        const prismaErr = err as { code?: string };
        if (prismaErr.code !== "P2002") throw err;
      }
    }
  }

  logger.progress("Treasury bill entries", count);
}
