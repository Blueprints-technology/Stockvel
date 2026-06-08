import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssetType } from '@prisma/client';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WatchlistItemDto {
  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  assetType!: AssetType;

  @ApiProperty()
  @IsString()
  assetSymbol!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}

export class ReorderWatchlistDto {
  @ApiProperty({ type: [WatchlistItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WatchlistItemDto)
  items!: WatchlistItemDto[];
}
