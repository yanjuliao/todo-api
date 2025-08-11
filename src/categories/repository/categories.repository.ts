import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly ormRepo: Repository<Category>,
  ) {}

  create(partial: Partial<Category>): Category {
    return this.ormRepo.create(partial);
  }

  save(entity: Category): Promise<Category> {
    return this.ormRepo.save(entity);
  }

  findAll(): Promise<Category[]> {
    return this.ormRepo.find();
  }

  findOneById(id: number): Promise<Category | null> {
    return this.ormRepo.findOne({ where: { id } });
  }
  
  async remove(entity: Category): Promise<void> {
    await this.ormRepo.remove(entity);
  }

  async existsByName(name: string, excludeId?: number): Promise<boolean> {
    const qb = this.ormRepo
      .createQueryBuilder('c')
      .where('LOWER(c.name) = LOWER(:name)', { name: name.trim() });
    if (excludeId != null) qb.andWhere('c.id != :excludeId', { excludeId });
    const count = await qb.getCount();
    return count > 0;
  }
}
