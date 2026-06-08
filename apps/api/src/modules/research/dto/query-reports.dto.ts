import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ResearchReportType } from '@prisma/client';

export class QueryReportsDto {
  @ApiPropertyOptional({ enum: ResearchReportType })
  @IsOptional()
  @IsEnum(ResearchReportType)
  type?: ResearchReportType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 12;
}
