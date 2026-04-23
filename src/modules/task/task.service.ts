import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: [{ createdAt: 'desc' }]
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const data: Prisma.TaskCreateInput = {
      title: dto.title.trim(),
      description: dto.description?.trim() || null,
      status: dto.status ?? 'todo'
    };

    return this.prisma.task.create({ data });
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);

    const data: Prisma.TaskUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined) {
      data.description = dto.description?.trim() || null;
    }
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
  }
}
