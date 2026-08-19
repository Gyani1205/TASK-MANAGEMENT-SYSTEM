import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

const AUTHOR_SELECT = { select: { id: true, name: true, username: true, avatarUrl: true } };

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private activities: ActivitiesService,
  ) {}

  async create(userId: string, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: { body: dto.body, taskId: dto.taskId, authorId: userId, parentId: dto.parentId },
      include: { author: AUTHOR_SELECT },
    });

    await this.activities.log({
      taskId: dto.taskId,
      userId,
      type: 'COMMENT_ADDED',
      message: dto.parentId ? 'replied to a comment' : 'added a comment',
    });

    return comment;
  }

  async findForTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId, parentId: null },
      include: {
        author: AUTHOR_SELECT,
        replies: { include: { author: AUTHOR_SELECT }, orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async findRaw(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: string, userId: string, dto: UpdateCommentDto) {
    const comment = await this.findRaw(id);
    if (comment.authorId !== userId) throw new ForbiddenException('You can only edit your own comments');
    return this.prisma.comment.update({ where: { id }, data: { body: dto.body }, include: { author: AUTHOR_SELECT } });
  }

  async remove(id: string, userId: string) {
    const comment = await this.findRaw(id);
    if (comment.authorId !== userId) throw new ForbiddenException('You can only delete your own comments');
    await this.prisma.comment.delete({ where: { id } });
    return { success: true };
  }
}
