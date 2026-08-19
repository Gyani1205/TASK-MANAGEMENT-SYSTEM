import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('subtasks')
@ApiBearerAuth()
@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  @ApiOperation({ summary: 'Add a subtask to a task' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateSubtaskDto) {
    return this.subtasksService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List subtasks for a task, with computed completion progress' })
  findAll(@Query('taskId') taskId: string) {
    return this.subtasksService.findForTask(taskId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subtask (title or completion checkbox)' })
  update(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: UpdateSubtaskDto) {
    return this.subtasksService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subtask' })
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}
