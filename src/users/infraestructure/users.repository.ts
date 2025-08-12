import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepo: Repository<User>,
  ) {}

  create(partial: Partial<User>): User {
    return this.ormRepo.create(partial);
  }

  save(entity: User): Promise<User> {
    return this.ormRepo.save(entity);
  }

  findAll(): Promise<User[]> {
    return this.ormRepo.find();
  }

  findOneById(id: number): Promise<User | null> {
    return this.ormRepo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.ormRepo.findOne({ where: { email } });
  }

  async remove(entity: User): Promise<void> {
    await this.ormRepo.remove(entity);
  }

  async existsByEmail(email: string, excludeId?: number): Promise<boolean> {
    const qb = this.ormRepo.createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email: email.trim().toLowerCase() });
    if (excludeId != null) qb.andWhere('u.id != :excludeId', { excludeId });
    const count = await qb.getCount();
    return count > 0;
  }
}
