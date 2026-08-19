import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ThemeMode, AccentColor } from '@prisma/client';

export class UpdateThemeDto {
  @ApiPropertyOptional({ enum: ThemeMode })
  @IsOptional()
  @IsEnum(ThemeMode)
  mode?: ThemeMode;

  @ApiPropertyOptional({ enum: AccentColor })
  @IsOptional()
  @IsEnum(AccentColor)
  accent?: AccentColor;
}
