import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Task } from '@prisma/client';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({
    summary: 'List tasks',
    description: 'Returns all tasks ordered by creation date (newest first).'
  })
  @ApiOkResponse({ type: [TaskEntity] })
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Task UUID' })
  @ApiOkResponse({ type: TaskEntity })
  @ApiNotFoundResponse({ description: 'Task not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a task' })
  @ApiCreatedResponse({ type: TaskEntity })
  @ApiBadRequestResponse({ description: 'Validation error' })
  create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Task UUID' })
  @ApiOkResponse({ type: TaskEntity })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto
  ): Promise<Task> {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Task UUID' })
  @ApiNoContentResponse({ description: 'Task deleted successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.taskService.remove(id);
  }
}
