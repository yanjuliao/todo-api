import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TodoStatus } from '../../enums/todo-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterTodoQueryDto {
  @ApiPropertyOptional({
    enum: TodoStatus,
    example: TodoStatus.DONE,
    description: 'Filter tasks by status',
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @ApiPropertyOptional({
    example: 2,
    description: 'Filter tasks by category ID',
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
