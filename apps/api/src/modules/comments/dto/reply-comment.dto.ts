import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ReplyCommentDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  content!: string;
}
