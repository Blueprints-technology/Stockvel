import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssetType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpsertPortfolioAssetDto {
  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  assetType!: AssetType;

  @ApiProperty()
  @IsString()
  assetSymbol!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.0000001)
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  buyPrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
