import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../config/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  username: true,
  name: true,
  avatarUrl: true,
  isGuest: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new ConflictException('Email or username already in use');
    }

    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 12) : null;

    return this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        name: dto.name,
        password: hashedPassword,
      },
    });
  }

  async createGuest() {
    const suffix = Math.random().toString(36).slice(2, 8);
    return this.prisma.$transaction(async (tx) => {
      const guest = await tx.user.create({
        data: {
          email: `guest-${suffix}@taskflow.local`,
          username: `guest_${suffix}`,
          name: 'Guest User',
          isGuest: true,
        },
      });

      await tx.workspace.create({
        data: {
          name: 'Guest Workspace',
          description: 'Temporary workspace for this guest session',
          slug: `guest-${suffix}`,
          ownerId: guest.id,
          members: { create: { userId: guest.id, role: Role.OWNER } },
        },
      });

      return guest;
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  /** Internal use only (Auth module) — includes password hash and refresh token hash. */
  async findRawById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: PUBLIC_USER_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOrCreateFromGoogle(profile: { googleId: string; email: string; name: string; avatarUrl?: string }) {
    const existing = await this.findByGoogleId(profile.googleId);
    if (existing) return existing;

    const byEmail = await this.findByEmail(profile.email);
    if (byEmail) {
      return this.prisma.user.update({ where: { id: byEmail.id }, data: { googleId: profile.googleId } });
    }

    const suffix = Math.random().toString(36).slice(2, 6);
    return this.prisma.user.create({
      data: {
        email: profile.email,
        username: `${profile.name.toLowerCase().replace(/\s+/g, '')}${suffix}`,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        googleId: profile.googleId,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: PUBLIC_USER_SELECT,
    });
  }

  async setRefreshToken(id: string, refreshToken: string | null) {
    const hashed = refreshToken ? await bcrypt.hash(refreshToken, 12) : null;
    return this.prisma.user.update({ where: { id }, data: { refreshToken: hashed } });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  async searchByName(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: PUBLIC_USER_SELECT,
      take: 10,
    });
  }
}
