import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('workspaces')
@ApiBearerAuth()
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a workspace (creator becomes OWNER)' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: "List all workspaces the current user belongs to" })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.workspacesService.findAllForUser(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace details, members, and projects' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.workspacesService.findOne(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workspace name/description' })
  update(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, user.sub, dto);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add or update a member and their role' })
  addMember(@Param('id') id: string, @CurrentUser() user: JwtPayload, @Body() dto: AddMemberDto) {
    return this.workspacesService.addMember(id, user.sub, dto);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from the workspace (or leave it yourself)' })
  removeMember(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: JwtPayload) {
    return this.workspacesService.removeMember(id, user.sub, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workspace (owner only)' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.workspacesService.remove(id, user.sub);
  }
}
