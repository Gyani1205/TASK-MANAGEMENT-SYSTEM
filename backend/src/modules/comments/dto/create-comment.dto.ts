import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  body: string;

  @ApiProperty()
  @IsString()
  taskId: string;

  @ApiPropertyOptional({ description: 'Parent comment id, for replies' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
