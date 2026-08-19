import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UpdateFieldPreferenceDto } from './dto/update-field-preference.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getFieldPreferences(userId: string) {
    const existing = await this.prisma.fieldPreference.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.fieldPreference.create({ data: { userId } });
  }

  async updateFieldPreferences(userId: string, dto: UpdateFieldPreferenceDto) {
    return this.prisma.fieldPreference.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }
}
