"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTreasury = seedTreasury;
const treasury_json_1 = __importDefault(require("../data/treasury.json"));
const validate_1 = require("../utils/validate");
const logger_1 = require("../utils/logger");
async function seedTreasury(tx) {
    logger_1.logger.info("Seeding treasury bill data...");
    const series = treasury_json_1.default.map((t) => validate_1.TreasurySchema.parse(t));
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
            }
            catch (err) {
                const prismaErr = err;
                if (prismaErr.code !== "P2002")
                    throw err;
            }
        }
    }
    logger_1.logger.progress("Treasury bill entries", count);
}
//# sourceMappingURL=treasury.js.map