import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/requests/create-todo.dto';
import { UpdateTodoDto } from './dto/requests/update-todo.dto';
import { FilterTodoQueryDto } from './dto/requests/filter-todo.query.dto';
import { TodoResponseDto } from './dto/response/todo.response.dto';
import {
  applyTodoUpdateFromDto,
  buildTodoEntityFromCreateDto,
  toTodoResponse,
} from './mapper/todo.mapper';
import { TodosRepository } from './repository/todos.repository';
import { TODO_MESSAGES } from './constants/messages';
import { CategoriesRepository } from 'src/categories/repository/categories.repository';
import { CATEGORY_MESSAGES } from 'src/categories/constants/messages';
import { toDto } from 'src/common/to-dto';

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

    if (dto.categoryId !== undefined) {
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
