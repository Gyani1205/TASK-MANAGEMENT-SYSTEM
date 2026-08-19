import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks with filtering, search, sorting, and pagination' })
  findAll(@Query() query: QueryTasksDto) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full task details, including subtasks and comments' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task (auto-logs status/priority/assignee/due-date changes)' })
  update(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, user.sub, dto);
  }

  @Patch(':id/reorder')
  @ApiOperation({ summary: 'Move a task to a new column/position (used by the Kanban drag & drop)' })
  reorder(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: ReorderTaskDto) {
    return this.tasksService.reorder(id, user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
