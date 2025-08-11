import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TodoStatus } from '../../enums/todo-status.enum';
import { CategorySummaryDto } from '../../../categories/dto/response/category-summary.dto';

export class TodoResponseDto {
  @ApiProperty({
    example: 42,
    description: 'Unique identifier of the task',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'Finish NestJS challenge',
    description: 'Title of the task',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'Implement endpoints, DTOs, and docs',
    description: 'Detailed description of the task',
    required: false,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    enum: TodoStatus,
    example: TodoStatus.PENDING, 
    description: 'Current status of the task',
  })
  @Expose()
  status: TodoStatus;

  @ApiProperty({
    example: 3,
    description: 'ID of the category associated with this task',
  })
  @Expose()
  categoryId: number; 

  @ApiProperty({
    type: () => CategorySummaryDto,
    description: 'Summary of the associated category',
  })
  @Expose()
  @Type(() => CategorySummaryDto)
  category: CategorySummaryDto; 

  @ApiProperty({
    example: '2025-08-11T14:35:00.000Z',
    description: 'Creation date (ISO 8601)',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2025-08-11T15:10:00.000Z',
    description: 'Last update date (ISO 8601)',
  })
  @Expose()
  updatedAt: Date;
}
