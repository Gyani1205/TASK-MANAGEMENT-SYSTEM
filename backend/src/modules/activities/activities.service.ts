import { Injectable } from '@nestjs/common';
import { ActivityType, Prisma } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Central helper used by other modules (Tasks, Comments, Subtasks, Labels)
   * to append an entry to a task's activity timeline.
   */
  async log(params: {
    taskId: string;
    userId: string;
    type: ActivityType;
    message: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.activityLog.create({
      data: {
        taskId: params.taskId,
        userId: params.userId,
        type: params.type,
        message: params.message,
        metadata: params.metadata,
      },
    });
  }

  async findForTask(taskId: string) {
    return this.prisma.activityLog.findMany({
      where: { taskId },
      include: {
        user: { select: { id: true, name: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForProject(projectId: string) {
    return this.prisma.activityLog.findMany({
      where: { task: { projectId } },
      include: {
        user: { select: { id: true, name: true, username: true, avatarUrl: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
