import { IsString, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class ReorderTaskDto {
  @ApiProperty({ enum: TaskStatus, description: 'Destination column' })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ description: 'New zero-based position within the destination column' })
  @IsInt()
  position: number;
}
