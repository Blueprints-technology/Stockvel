"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProviderLogs = seedProviderLogs;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
async function seedProviderLogs(tx, providers) {
    logger_1.logger.info("Seeding provider status logs...");
    let count = 0;
    for (const provider of providers) {
        try {
            await tx.providerStatusLog.create({
                data: {
                    providerId: provider.id,
                    status: provider.slug === "ngx"
                        ? client_1.ProviderHealthStatus.HEALTHY
                        : client_1.ProviderHealthStatus.DEGRADED,
                    responseTimeMs: provider.slug === "ngx" ? 480 : 930,
                    errorMessage: provider.slug === "ngx" ? null : "Fallback mode — sample status.",
                },
            });
            count++;
        }
        catch (err) {
            const prismaErr = err;
            if (prismaErr.code !== "P2002")
                throw err;
        }
    }
    logger_1.logger.progress("Provider status logs", count);
}
//# sourceMappingURL=providers.js.map