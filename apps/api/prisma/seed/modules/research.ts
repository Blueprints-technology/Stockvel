import {
  Prisma,
  ResearchReportStatus,
  ResearchReportType,
} from "@prisma/client";
import rawResearchData from "../data/research.json";
import { ResearchReportSchema } from "../utils/validate";
import { logger } from "../utils/logger";

export async function seedResearch(tx: Prisma.TransactionClient) {
  logger.info("Seeding research reports...");

  const reports = rawResearchData.map((r) => ResearchReportSchema.parse(r));

  for (const report of reports) {
    await tx.researchReport.upsert({
      where: { slug: report.slug },
      update: {
        ...report,
        type: report.type as ResearchReportType,
        status: ResearchReportStatus.PUBLISHED,
        reportDate: new Date(),
      },
      create: {
        ...report,
        type: report.type as ResearchReportType,
        status: ResearchReportStatus.PUBLISHED,
        reportDate: new Date(),
      },
    });
  }

  logger.progress("Research reports", reports.length);
}
