import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Short title of the task',
    example: 'Design landing page hero',
    minLength: 2,
    maxLength: 120
  })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task',
    example: 'Use the new brand palette. Include CTA and social proof.',
    maxLength: 2000,
    nullable: true
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Initial status. Defaults to "todo".',
    enum: ['todo', 'in_progress', 'done'],
    example: 'todo'
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
