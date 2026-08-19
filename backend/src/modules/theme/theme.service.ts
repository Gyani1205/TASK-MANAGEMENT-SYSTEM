import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  async getForUser(userId: string) {
    const existing = await this.prisma.themePreference.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.themePreference.create({ data: { userId } });
  }

  async update(userId: string, dto: UpdateThemeDto) {
    return this.prisma.themePreference.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }
}
