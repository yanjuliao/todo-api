import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiPropertyOptional({
    example: 3,
    description: 'New category ID to associate with this task',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;
}
