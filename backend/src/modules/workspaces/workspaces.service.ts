import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';

function slugify(name: string) {
  return `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).slice(2, 6)}`;
}

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: dto.name,
        description: dto.description,
        slug: slugify(dto.name),
        ownerId: userId,
        members: { create: { userId, role: Role.OWNER } },
      },
      include: { members: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } } },
    });
  }

 async findAllForUser(userId: string): Promise<any[]> {
    const workspaces = await this.prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      include: {
        _count: { select: { projects: true, members: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Repair guest sessions created before guest workspace provisioning existed.
    if (workspaces.length === 0) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { isGuest: true } });
      if (user?.isGuest) {
        const suffix = Math.random().toString(36).slice(2, 8);
        await this.prisma.workspace.create({
          data: {
            name: 'Guest Workspace',
            description: 'Temporary workspace for this guest session',
            slug: `guest-${suffix}`,
            ownerId: userId,
            members: { create: { userId, role: Role.OWNER } },
          },
        });

        return this.findAllForUser(userId);
      }
    }

    return workspaces;
  }

  private async assertMember(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });
    if (!membership) throw new ForbiddenException('You are not a member of this workspace');
    return membership;
  }

  async findOne(id: string, userId: string) {
    await this.assertMember(id, userId);
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true, username: true, avatarUrl: true } } } },
        projects: true,
      },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  async update(id: string, userId: string, dto: UpdateWorkspaceDto) {
    const membership = await this.assertMember(id, userId);
    if (membership.role !== Role.OWNER && membership.role !== Role.ADMIN) {
      throw new ForbiddenException('Only owners and admins can update the workspace');
    }
    return this.prisma.workspace.update({ where: { id }, data: dto });
  }

  async addMember(id: string, requesterId: string, dto: AddMemberDto) {
    const membership = await this.assertMember(id, requesterId);
    if (membership.role !== Role.OWNER && membership.role !== Role.ADMIN) {
      throw new ForbiddenException('Only owners and admins can add members');
    }
    return this.prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: dto.userId, workspaceId: id } },
      update: { role: dto.role },
      create: { userId: dto.userId, workspaceId: id, role: dto.role },
    });
  }

  async removeMember(id: string, requesterId: string, memberUserId: string) {
    const membership = await this.assertMember(id, requesterId);
    const isSelf = requesterId === memberUserId;
    if (!isSelf && membership.role !== Role.OWNER && membership.role !== Role.ADMIN) {
      throw new ForbiddenException('Only owners and admins can remove other members');
    }
    await this.prisma.workspaceMember.delete({
      where: { userId_workspaceId: { userId: memberUserId, workspaceId: id } },
    });
    return { success: true };
  }

  async remove(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({ where: { id } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    if (workspace.ownerId !== userId) throw new ForbiddenException('Only the owner can delete the workspace');
    await this.prisma.workspace.delete({ where: { id } });
    return { success: true };
  }
}
