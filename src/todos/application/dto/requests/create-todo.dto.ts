import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TodoStatus } from 'src/todos/domain/enums/todo-status.enum';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Buy milk',
    description: 'Task title (max 120 characters)',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiProperty({
    required: false,
    example: 'Buy skimmed milk at the grocery store.',
    description: 'Detailed description (optional, max 500 characters)',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    enum: TodoStatus,
    required: false,
    example: TodoStatus.PENDING,
    description: 'Initial task status (optional)',
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @ApiProperty({
    example: 1,
    description: 'Category ID associated with this task',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  categoryId: number;
}
