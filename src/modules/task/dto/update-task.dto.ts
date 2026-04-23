import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Short title of the task',
    example: 'Design landing page hero (v2)',
    minLength: 2,
    maxLength: 120
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task',
    example: 'Updated acceptance criteria.',
    maxLength: 2000,
    nullable: true
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Workflow status',
    enum: ['todo', 'in_progress', 'done'],
    example: 'in_progress'
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
