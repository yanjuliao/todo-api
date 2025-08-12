import { Injectable, NotFoundException } from '@nestjs/common';
import {
  applyTodoUpdateFromDto,
  buildTodoEntityFromCreateDto,
  toTodoResponse,
} from '../application/todo.mapper';
import { TodosRepository } from '../infraestructure/todos.repository';
import { TODO_MESSAGES } from './constants/messages';
import { CategoriesRepository } from 'src/categories/infraestructure/categories.repository';
import { CATEGORY_MESSAGES } from 'src/categories/domain/constants/messages';
import { toDto } from 'src/common/to-dto';
import { CreateTodoDto } from '../application/dto/requests/create-todo.dto';
import { FilterTodoQueryDto } from '../application/dto/requests/filter-todo.query.dto';
import { UpdateTodoDto } from '../application/dto/requests/update-todo.dto';
import { TodoResponseDto } from '../application/dto/response/todo.response.dto';

@Injectable()
export class TodosService {
  constructor(
    private readonly repo: TodosRepository,
    private readonly categoriesRepo: CategoriesRepository,
  ) {}

  async create(dto: CreateTodoDto): Promise<TodoResponseDto> {
    const category = await this.categoriesRepo.findOneById(dto.categoryId);
    if (!category) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND);

    const draft = buildTodoEntityFromCreateDto(dto);
    const entity = this.repo.create(draft);

    const saved = await this.repo.save(entity);
    const withRel = await this.repo.reloadById(saved.id);
    return toDto(TodoResponseDto, toTodoResponse(withRel!));
  }

  async findAll(query?: FilterTodoQueryDto): Promise<TodoResponseDto[]> {
    const list = await this.repo.findAllWithFilters(query);
    return list.map((t) => toDto(TodoResponseDto, toTodoResponse(t)));
  }

  async findOne(id: number): Promise<TodoResponseDto> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(TODO_MESSAGES.NOT_FOUND);
    return toDto(TodoResponseDto, toTodoResponse(found));
  }

  async update(id: number, dto: UpdateTodoDto): Promise<TodoResponseDto> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(TODO_MESSAGES.NOT_FOUND);

    if (dto.categoryId) {
      const category = await this.categoriesRepo.findOneById(dto.categoryId);
      if (!category) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND);
    }

    applyTodoUpdateFromDto(found, dto);

    const saved = await this.repo.save(found);
    const withRel = await this.repo.reloadById(saved.id);
    return toDto(TodoResponseDto, toTodoResponse(withRel!));
  }

  async remove(id: number): Promise<void> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(TODO_MESSAGES.NOT_FOUND);
    await this.repo.remove(found);
  }
}
