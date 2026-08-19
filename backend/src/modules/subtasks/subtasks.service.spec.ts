import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { PrismaService } from '../../config/prisma.service';
import { ActivitiesService } from '../activities/activities.service';

describe('SubtasksService', () => {
  let service: SubtasksService;
  let prisma: { subtask: Record<string, jest.Mock> };
  let activities: jest.Mocked<ActivitiesService>;

  beforeEach(async () => {
    prisma = {
      subtask: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SubtasksService,
        { provide: PrismaService, useValue: prisma },
        { provide: ActivitiesService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = moduleRef.get(SubtasksService);
    activities = moduleRef.get(ActivitiesService);
  });

  describe('findForTask', () => {
    it('computes 0% progress for a task with no subtasks', async () => {
      prisma.subtask.findMany.mockResolvedValue([]);
      const result = await service.findForTask('task_1');
      expect(result.progress).toBe(0);
    });

    it('computes the rounded percentage of completed subtasks', async () => {
      prisma.subtask.findMany.mockResolvedValue([
        { id: '1', isDone: true },
        { id: '2', isDone: true },
        { id: '3', isDone: false },
      ]);
      const result = await service.findForTask('task_1');
      expect(result.progress).toBe(67); // 2/3 rounded
    });

    it('reports 100% when every subtask is done', async () => {
      prisma.subtask.findMany.mockResolvedValue([{ id: '1', isDone: true }]);
      const result = await service.findForTask('task_1');
      expect(result.progress).toBe(100);
    });
  });

  describe('update', () => {
    it('throws NotFoundException for a missing subtask', async () => {
      prisma.subtask.findUnique.mockResolvedValue(null);
      await expect(service.update('missing', 'user_1', { isDone: true })).rejects.toThrow(NotFoundException);
    });

    it('logs SUBTASK_COMPLETED only on the false → true transition', async () => {
      prisma.subtask.findUnique.mockResolvedValue({ id: 's1', taskId: 't1', title: 'Write tests', isDone: false });
      prisma.subtask.update.mockResolvedValue({ id: 's1', isDone: true });

      await service.update('s1', 'user_1', { isDone: true });

      expect(activities.log).toHaveBeenCalledWith(expect.objectContaining({ type: 'SUBTASK_COMPLETED' }));
    });

    it('does not log when toggling an already-completed subtask back off', async () => {
      prisma.subtask.findUnique.mockResolvedValue({ id: 's1', taskId: 't1', title: 'Write tests', isDone: true });
      prisma.subtask.update.mockResolvedValue({ id: 's1', isDone: false });

      await service.update('s1', 'user_1', { isDone: false });

      expect(activities.log).not.toHaveBeenCalled();
    });
  });
});
