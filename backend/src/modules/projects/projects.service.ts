import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private async assertWorkspaceMember(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });
    if (!membership) throw new ForbiddenException('You are not a member of this workspace');
    return membership;
  }

  async create(userId: string, dto: CreateProjectDto) {
    await this.assertWorkspaceMember(dto.workspaceId, userId);

    const existing = await this.prisma.project.findUnique({
      where: { workspaceId_key: { workspaceId: dto.workspaceId, key: dto.key.toUpperCase() } },
    });
    if (existing) throw new ConflictException('A project with this key already exists in the workspace');

    return this.prisma.project.create({
      data: { ...dto, key: dto.key.toUpperCase() },
    });
  }

  async findAllForWorkspace(workspaceId: string, userId: string) {
    await this.assertWorkspaceMember(workspaceId, userId);
    return this.prisma.project.findMany({
      where: { workspaceId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { labels: true, _count: { select: { tasks: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    await this.assertWorkspaceMember(project.workspaceId, userId);
    return project;
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.findOne(id, userId);
    return this.prisma.project.update({
      where: { id: project.id },
      data: dto.key ? { ...dto, key: dto.key.toUpperCase() } : dto,
    });
  }

  async remove(id: string, userId: string) {
    const project = await this.findOne(id, userId);
    await this.prisma.project.delete({ where: { id: project.id } });
    return { success: true };
  }
}
