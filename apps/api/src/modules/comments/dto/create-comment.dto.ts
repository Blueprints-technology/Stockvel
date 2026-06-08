import { ApiProperty } from '@nestjs/swagger';
import { AssetType } from '@prisma/client';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  assetType!: AssetType;

  @ApiProperty()
  @IsString()
  assetSymbol!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  content!: string;
}
