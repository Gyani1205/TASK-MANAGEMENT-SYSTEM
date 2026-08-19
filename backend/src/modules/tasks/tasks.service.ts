import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

const TASK_INCLUDE = {
  assignees: { include: { user: { select: { id: true, name: true, username: true, avatarUrl: true } } } },
  labels: { include: { label: true } },
  reporter: { select: { id: true, name: true, username: true, avatarUrl: true } },
  subtasks: true,
  _count: { select: { comments: true, subtasks: true } },
} satisfies Prisma.TaskInclude;

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private activities: ActivitiesService,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    const lastInColumn = await this.prisma.task.findFirst({
      where: { projectId: dto.projectId, status: dto.status ?? 'TODO' },
      orderBy: { position: 'desc' },
    });

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        status: dto.status ?? 'TODO',
        priority: dto.priority ?? 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position: (lastInColumn?.position ?? -1) + 1,
        reporterId: userId,
        assignees: dto.assigneeIds ? { create: dto.assigneeIds.map((userId) => ({ userId })) } : undefined,
        labels: dto.labelIds ? { create: dto.labelIds.map((labelId) => ({ labelId })) } : undefined,
      },
      include: TASK_INCLUDE,
    });

    await this.activities.log({
      taskId: task.id,
      userId,
      type: 'TASK_CREATED',
      message: `created this task`,
    });

    return task;
  }

  async findAll(query: QueryTasksDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;

    const where: Prisma.TaskWhereInput = {
      ...(query.projectId && { projectId: query.projectId }),
      ...(query.status && { status: query.status }),
      ...(query.priority && { priority: query.priority }),
      ...(query.reporterId && { reporterId: query.reporterId }),
      ...(query.assigneeId && { assignees: { some: { userId: { in: query.assigneeId.split(',') } } } }),
      ...(query.labelId && { labels: { some: { labelId: { in: query.labelId.split(',') } } } }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy: Prisma.TaskOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder ?? 'asc' }
      : { position: 'asc' };

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        include: TASK_INCLUDE,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ...TASK_INCLUDE,
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { id: true, name: true, username: true, avatarUrl: true } },
            replies: { include: { author: { select: { id: true, name: true, username: true, avatarUrl: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  private async findRaw(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const existing = await this.findRaw(id);

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assignees: dto.assigneeIds
          ? { deleteMany: {}, create: dto.assigneeIds.map((userId) => ({ userId })) }
          : undefined,
        labels: dto.labelIds ? { deleteMany: {}, create: dto.labelIds.map((labelId) => ({ labelId })) } : undefined,
      },
      include: TASK_INCLUDE,
    });

    if (dto.status && dto.status !== existing.status) {
      await this.activities.log({
        taskId: id,
        userId,
        type: 'STATUS_CHANGED',
        message: `changed status from ${existing.status} to ${dto.status}`,
      });
    }
    if (dto.priority && dto.priority !== existing.priority) {
      await this.activities.log({
        taskId: id,
        userId,
        type: 'PRIORITY_CHANGED',
        message: `changed priority from ${existing.priority} to ${dto.priority}`,
      });
    }
    if (dto.assigneeIds) {
      await this.activities.log({ taskId: id, userId, type: 'MEMBER_CHANGED', message: 'updated assignees' });
    }
    if (dto.dueDate && new Date(dto.dueDate).getTime() !== existing.dueDate?.getTime()) {
      await this.activities.log({ taskId: id, userId, type: 'DUE_DATE_CHANGED', message: 'updated the due date' });
    }
    if (dto.title || dto.description) {
      await this.activities.log({ taskId: id, userId, type: 'TASK_UPDATED', message: 'edited task details' });
    }

    return task;
  }

  /**
   * Drag & drop reorder: moves a task to a new column/position and shifts
   * sibling positions so ordering stays contiguous. Wrapped in a transaction.
   */
  async reorder(id: string, userId: string, dto: ReorderTaskDto) {
    const task = await this.findRaw(id);

    await this.prisma.$transaction(async (tx) => {
      // Close the gap in the source column
      await tx.task.updateMany({
        where: { projectId: task.projectId, status: task.status, position: { gt: task.position } },
        data: { position: { decrement: 1 } },
      });

      // Open a gap in the destination column
      await tx.task.updateMany({
        where: { projectId: task.projectId, status: dto.status, position: { gte: dto.position } },
        data: { position: { increment: 1 } },
      });

      await tx.task.update({
        where: { id },
        data: { status: dto.status, position: dto.position },
      });
    });

    if (dto.status !== task.status) {
      await this.activities.log({
        taskId: id,
        userId,
        type: 'STATUS_CHANGED',
        message: `moved this task from ${task.status} to ${dto.status}`,
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findRaw(id);
    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }
}
