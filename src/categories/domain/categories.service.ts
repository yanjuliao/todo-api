import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { toCategoryResponse } from '../application/category.mapper';
import { CategoriesRepository } from '../infraestructure/categories.repository';
import { CATEGORY_MESSAGES } from './constants/messages';
import { TodosRepository } from 'src/todos/infraestructure/todos.repository';
import { toDto } from 'src/common/to-dto';
import { CreateCategoryDto } from '../application/dto/requests/create-category.dto';
import { UpdateCategoryDto } from '../application/dto/requests/update-category.dto';
import { CategoryResponseDto } from '../application/dto/response/category.response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repo: CategoriesRepository,
    private readonly todosRepo: TodosRepository,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const name = dto.name.trim();
    const description = dto.description?.trim();

    if (await this.repo.existsByName(name)) {
      throw new ConflictException(CATEGORY_MESSAGES.NAME_TAKEN);
    }

    const entity = this.repo.create({ name, description });
    const saved = await this.repo.save(entity);
    return toDto(CategoryResponseDto, toCategoryResponse(saved));
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const list = await this.repo.findAll();
    return list.map((c) => toDto(CategoryResponseDto, toCategoryResponse(c)));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND);
    return toDto(CategoryResponseDto, toCategoryResponse(found));
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND);

    if (dto.name) {
      const name = dto.name.trim();
      if (await this.repo.existsByName(name, id)) {
        throw new ConflictException(CATEGORY_MESSAGES.NAME_TAKEN);
      }
      found.name = name;
    }
    if (dto.description) {
      found.description = dto.description?.trim();
    }

    const saved = await this.repo.save(found);
    return toDto(CategoryResponseDto, toCategoryResponse(saved));
  }

  async remove(id: number): Promise<void> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND);

    const hasTodos = await this.todosRepo.existsByCategoryId(id);
    if (hasTodos) throw new BadRequestException(CATEGORY_MESSAGES.HAS_TODOS);

    await this.repo.remove(found);
  }
}
