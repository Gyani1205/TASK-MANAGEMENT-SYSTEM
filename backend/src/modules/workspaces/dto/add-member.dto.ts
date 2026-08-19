import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AddMemberDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: Role, default: Role.MEMBER })
  @IsEnum(Role)
  role: Role;
}
