import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@ApiTags('labels')
@ApiBearerAuth()
@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a label scoped to a project' })
  create(@Body() dto: CreateLabelDto) {
    return this.labelsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List labels for a project' })
  findAll(@Query('projectId') projectId: string) {
    return this.labelsService.findForProject(projectId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a label' })
  update(@Param('id') id: string, @Body() dto: UpdateLabelDto) {
    return this.labelsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a label' })
  remove(@Param('id') id: string) {
    return this.labelsService.remove(id);
  }
}
