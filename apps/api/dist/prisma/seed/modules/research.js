"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedResearch = seedResearch;
const client_1 = require("@prisma/client");
const research_json_1 = __importDefault(require("../data/research.json"));
const validate_1 = require("../utils/validate");
const logger_1 = require("../utils/logger");
async function seedResearch(tx) {
    logger_1.logger.info("Seeding research reports...");
    const reports = research_json_1.default.map((r) => validate_1.ResearchReportSchema.parse(r));
    for (const report of reports) {
        await tx.researchReport.upsert({
            where: { slug: report.slug },
            update: {
                ...report,
                type: report.type,
                status: client_1.ResearchReportStatus.PUBLISHED,
                reportDate: new Date(),
            },
            create: {
                ...report,
                type: report.type,
                status: client_1.ResearchReportStatus.PUBLISHED,
                reportDate: new Date(),
            },
        });
    }
    logger_1.logger.progress("Research reports", reports.length);
}
//# sourceMappingURL=research.js.map