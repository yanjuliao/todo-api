// src/todos/todos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodosRepository } from './repository/todos.repository';
import { CategoriesModule } from '../categories/categories.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), CategoriesModule],
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
})
export class TodosModule {}
