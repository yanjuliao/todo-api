// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './infraestructure/category.entity';
import { CategoriesService } from './domain/categories.service';
import { CategoriesController } from './application/categories.controller';
import { CategoriesRepository } from './infraestructure/categories.repository';
import { Todo } from '../todos/infraestructure/todo.entity';
import { TodosRepository } from '../todos/infraestructure/todos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Todo])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, TodosRepository],
  exports: [CategoriesRepository, TypeOrmModule],
})
export class CategoriesModule {}
