import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { FilterTodoQueryDto } from '../dto/requests/filter-todo.query.dto';

@Injectable()
export class TodosRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly ormRepo: Repository<Todo>,
  ) {}

  create(partial: Partial<Todo>): Todo {
    return this.ormRepo.create(partial);
  }

  save(entity: Todo): Promise<Todo> {
    return this.ormRepo.save(entity);
  }

  findOneById(id: number): Promise<Todo | null> {
    return this.baseQB().andWhere('todo.id = :id', { id }).getOne();
  }
  async findAllWithFilters(query?: FilterTodoQueryDto): Promise<Todo[]> {
    const qb = this.baseQB();

    if (query?.status) {
      qb.andWhere('todo.status = :status', { status: query.status });
    }

    // checagem contra null/undefined para não perder categoryId = 0 (defensivo)
    if (query?.categoryId != null) {
      qb.andWhere('todo.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    return qb.orderBy('todo.createdAt', 'DESC').getMany();
  }

  reloadById(id: number): Promise<Todo | null> {
    return this.findOneById(id);
  }

  async existsByCategoryId(categoryId: number): Promise<boolean> {
    const count = await this.ormRepo.count({ where: { categoryId } });
    return count > 0;
  }

  async remove(entity: Todo): Promise<void> {
    await this.ormRepo.remove(entity);
  }

  private baseQB(): SelectQueryBuilder<Todo> {
    return this.ormRepo
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.category', 'category');
  }
}
