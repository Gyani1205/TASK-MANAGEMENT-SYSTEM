import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../config/prisma.service';
import { ActivitiesService } from '../activities/activities.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let prisma: {
    task: Record<string, jest.Mock>;
    $transaction: jest.Mock;
  };
  let activities: jest.Mocked<ActivitiesService>;

  beforeEach(async () => {
    prisma = {
      task: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
        { provide: ActivitiesService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    tasksService = moduleRef.get(TasksService);
    activities = moduleRef.get(ActivitiesService);
  });

  describe('create', () => {
    it('places a new task at the end of its column (last position + 1)', async () => {
      prisma.task.findFirst.mockResolvedValue({ position: 3 });
      prisma.task.create.mockResolvedValue({ id: 'task_1', position: 4 });

      await tasksService.create('user_1', { title: 'Ship the release', projectId: 'proj_1' });

      expect(prisma.task.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ position: 4 }) }),
      );
    });

    it('starts a brand-new column at position 0', async () => {
      prisma.task.findFirst.mockResolvedValue(null);
      prisma.task.create.mockResolvedValue({ id: 'task_1', position: 0 });

      await tasksService.create('user_1', { title: 'First task', projectId: 'proj_1' });

      expect(prisma.task.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ position: 0 }) }),
      );
    });

    it('logs a TASK_CREATED activity entry', async () => {
      prisma.task.findFirst.mockResolvedValue(null);
      prisma.task.create.mockResolvedValue({ id: 'task_1', position: 0 });

      await tasksService.create('user_1', { title: 'First task', projectId: 'proj_1' });

      expect(activities.log).toHaveBeenCalledWith(
        expect.objectContaining({ taskId: 'task_1', userId: 'user_1', type: 'TASK_CREATED' }),
      );
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException for a missing task', async () => {
      prisma.task.findUnique.mockResolvedValue(null);
      await expect(tasksService.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reorder', () => {
    const existingTask = { id: 'task_1', projectId: 'proj_1', status: 'TODO', position: 2 };

    beforeEach(() => {
      prisma.task.findUnique.mockResolvedValue(existingTask);
      prisma.$transaction.mockImplementation(async (cb: any) => cb(prisma));
    });

    it('closes the gap in the source column and opens one in the destination column', async () => {
      await tasksService.reorder('task_1', 'user_1', { status: 'DOING', position: 0 });

      // Source column: shift everything after the moved task's old position down by one.
      expect(prisma.task.updateMany).toHaveBeenCalledWith({
        where: { projectId: 'proj_1', status: 'TODO', position: { gt: 2 } },
        data: { position: { decrement: 1 } },
      });

      // Destination column: shift everything at/after the target position up by one.
      expect(prisma.task.updateMany).toHaveBeenCalledWith({
        where: { projectId: 'proj_1', status: 'DOING', position: { gte: 0 } },
        data: { position: { increment: 1 } },
      });

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 'task_1' },
        data: { status: 'DOING', position: 0 },
      });
    });

    it('logs a STATUS_CHANGED activity entry only when the column actually changes', async () => {
      await tasksService.reorder('task_1', 'user_1', { status: 'DOING', position: 0 });
      expect(activities.log).toHaveBeenCalledWith(expect.objectContaining({ type: 'STATUS_CHANGED' }));
    });

    it('does not log an activity entry when reordering within the same column', async () => {
      await tasksService.reorder('task_1', 'user_1', { status: 'TODO', position: 0 });
      expect(activities.log).not.toHaveBeenCalled();
    });
  });
});
