import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFieldPreferenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visiblePriority?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visibleMembers?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visibleStatus?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visibleReporter?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visibleLabels?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  visibleDueDate?: boolean;
}
