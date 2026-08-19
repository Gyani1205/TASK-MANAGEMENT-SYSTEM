import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(
    private prisma: PrismaService,
    private activities: ActivitiesService,
  ) {}

  async create(userId: string, dto: CreateSubtaskDto) {
    const last = await this.prisma.subtask.findFirst({ where: { taskId: dto.taskId }, orderBy: { position: 'desc' } });

    const subtask = await this.prisma.subtask.create({
      data: { title: dto.title, taskId: dto.taskId, position: (last?.position ?? -1) + 1 },
    });

    await this.activities.log({
      taskId: dto.taskId,
      userId,
      type: 'SUBTASK_ADDED',
      message: `added subtask "${dto.title}"`,
    });

    return subtask;
  }

  async findForTask(taskId: string) {
    const subtasks = await this.prisma.subtask.findMany({ where: { taskId }, orderBy: { position: 'asc' } });
    const total = subtasks.length;
    const done = subtasks.filter((s) => s.isDone).length;
    return { subtasks, progress: total === 0 ? 0 : Math.round((done / total) * 100) };
  }

  private async findRaw(id: string) {
    const subtask = await this.prisma.subtask.findUnique({ where: { id } });
    if (!subtask) throw new NotFoundException('Subtask not found');
    return subtask;
  }

  async update(id: string, userId: string, dto: UpdateSubtaskDto) {
    const existing = await this.findRaw(id);
    const subtask = await this.prisma.subtask.update({ where: { id }, data: dto });

    if (dto.isDone !== undefined && dto.isDone !== existing.isDone && dto.isDone) {
      await this.activities.log({
        taskId: existing.taskId,
        userId,
        type: 'SUBTASK_COMPLETED',
        message: `completed subtask "${existing.title}"`,
      });
    }

    return subtask;
  }

  async remove(id: string) {
    await this.findRaw(id);
    await this.prisma.subtask.delete({ where: { id } });
    return { success: true };
  }
}
