import { toCategorySummary } from 'src/categories/application/category.mapper';
import { TodoStatus } from 'src/todos/domain/enums/todo-status.enum';
import { Todo } from 'src/todos/infraestructure/todo.entity';
import { CreateTodoDto } from './dto/requests/create-todo.dto';
import { UpdateTodoDto } from './dto/requests/update-todo.dto';
import { TodoResponseDto } from './dto/response/todo.response.dto';

export const toTodoResponse = (t: Todo): Omit<TodoResponseDto, never> => ({
  id: t.id,
  title: t.title,
  description: t.description,
  status: t.status,
  categoryId: t.categoryId,
  category: toCategorySummary(t.category!),
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

export function buildTodoEntityFromCreateDto(
  dto: CreateTodoDto,
): Partial<Todo> {
  return {
    title: dto.title?.trim(),
    description: dto.description?.trim() ?? '',
    status: dto.status ?? TodoStatus.PENDING,
    categoryId: dto.categoryId,
    category: { id: dto.categoryId } as any,
  };
}

export function applyTodoUpdateFromDto(entity: Todo, dto: UpdateTodoDto): void {
  if (dto.title !== undefined) entity.title = dto.title?.trim();
  if (dto.description !== undefined)
    entity.description = dto.description?.trim();
  if (dto.status !== undefined) entity.status = dto.status;
  if (dto.categoryId !== undefined) {
    entity.categoryId = dto.categoryId;
    entity.category = { id: dto.categoryId } as any;
  }
}
