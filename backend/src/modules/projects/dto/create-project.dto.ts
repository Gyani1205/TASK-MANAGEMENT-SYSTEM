import { IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Short project code, e.g. ENG', example: 'ENG' })
  @IsString()
  @MinLength(2)
  @MaxLength(6)
  @Matches(/^[A-Za-z0-9]+$/, { message: 'key must be alphanumeric' })
  key: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#6366F1' })
  @IsOptional()
  @Matches(/^#([0-9A-Fa-f]{3}){1,2}$/, { message: 'color must be a valid hex code' })
  color?: string;

  @ApiProperty()
  @IsString()
  workspaceId: string;
}
