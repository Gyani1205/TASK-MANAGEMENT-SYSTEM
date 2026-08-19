import { IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLabelDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: '#6366F1' })
  @IsOptional()
  @Matches(/^#([0-9A-Fa-f]{3}){1,2}$/, { message: 'color must be a valid hex code' })
  color?: string;

  @ApiProperty()
  @IsString()
  projectId: string;
}
