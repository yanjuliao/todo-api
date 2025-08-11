// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './repository/categories.repository';
import { Todo } from '../todos/entities/todo.entity';
import { TodosRepository } from '../todos/repository/todos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Todo])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, TodosRepository],
  exports: [CategoriesRepository, TypeOrmModule],
})
export class CategoriesModule {}
