import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryActivitiesDto {
  @ApiPropertyOptional({ description: 'Filter activity logs by task id' })
  @IsOptional()
  @IsString()
  taskId?: string;

  @ApiPropertyOptional({ description: 'Filter activity logs by project id' })
  @IsOptional()
  @IsString()
  projectId?: string;
}
