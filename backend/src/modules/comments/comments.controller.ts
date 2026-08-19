import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment or reply to a task' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List top-level comments (with nested replies) for a task' })
  findAll(@Query('taskId') taskId: string) {
    return this.commentsService.findForTask(taskId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit your own comment' })
  update(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete your own comment' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.commentsService.remove(id, user.sub);
  }
}
