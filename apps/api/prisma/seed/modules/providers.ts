import { Prisma, ProviderHealthStatus } from "@prisma/client";
import { logger } from "../utils/logger";

export async function seedProviderLogs(
  tx: Prisma.TransactionClient,
  providers: Array<{ id: string; slug: string }>,
) {
  logger.info("Seeding provider status logs...");

  let count = 0;
  for (const provider of providers) {
    try {
      await tx.providerStatusLog.create({
        data: {
          providerId: provider.id,
          status:
            provider.slug === "ngx"
              ? ProviderHealthStatus.HEALTHY
              : ProviderHealthStatus.DEGRADED,
          responseTimeMs: provider.slug === "ngx" ? 480 : 930,
          errorMessage:
            provider.slug === "ngx" ? null : "Fallback mode — sample status.",
        },
      });
      count++;
    } catch (err: unknown) {
      const prismaErr = err as { code?: string };
      if (prismaErr.code !== "P2002") throw err;
    }
  }

  logger.progress("Provider status logs", count);
}
