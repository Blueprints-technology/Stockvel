import { ResearchReportType } from '@prisma/client';
export declare class QueryReportsDto {
    type?: ResearchReportType;
    year?: number;
    page?: number;
    limit?: number;
}
