import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class TaskEntity {
  @ApiProperty({
    description: 'Unique identifier (UUID v4)',
    example: '62d94204-d2f8-474b-809f-e7d9be78f622',
    format: 'uuid'
  })
  id!: string;

  @ApiProperty({
    description: 'Short title of the task',
    example: 'Design landing page hero'
  })
  title!: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Use the new brand palette. Include CTA and social proof.',
    nullable: true,
    required: false
  })
  description!: string | null;

  @ApiProperty({
    description: 'Current workflow status',
    enum: ['todo', 'in_progress', 'done'],
    example: 'todo'
  })
  status!: TaskStatus;

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601)',
    example: '2026-04-23T03:57:32.809Z',
    format: 'date-time'
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp (ISO 8601)',
    example: '2026-04-23T03:57:32.809Z',
    format: 'date-time'
  })
  updatedAt!: Date;
}
