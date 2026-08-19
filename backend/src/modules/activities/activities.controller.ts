import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { QueryActivitiesDto } from './dto/query-activities.dto';
import { BadRequestException } from '@nestjs/common';

@ApiTags('activities')
@ApiBearerAuth()
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List activity log entries for a task or project' })
  findAll(@Query() query: QueryActivitiesDto) {
    if (query.taskId) return this.activitiesService.findForTask(query.taskId);
    if (query.projectId) return this.activitiesService.findForProject(query.projectId);
    throw new BadRequestException('Either taskId or projectId query param is required');
  }
}
