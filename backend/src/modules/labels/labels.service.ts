import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLabelDto) {
    const existing = await this.prisma.label.findUnique({
      where: { projectId_name: { projectId: dto.projectId, name: dto.name } },
    });
    if (existing) throw new ConflictException('A label with this name already exists in the project');

    return this.prisma.label.create({ data: dto });
  }

  async findForProject(projectId: string) {
    return this.prisma.label.findMany({ where: { projectId }, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const label = await this.prisma.label.findUnique({ where: { id } });
    if (!label) throw new NotFoundException('Label not found');
    return label;
  }

  async update(id: string, dto: UpdateLabelDto) {
    await this.findOne(id);
    return this.prisma.label.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.label.delete({ where: { id } });
    return { success: true };
  }
}
