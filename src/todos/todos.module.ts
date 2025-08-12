import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './infraestructure/todo.entity';
import { TodosService } from './domain/todos.service';
import { TodosController } from './application/todos.controller';
import { TodosRepository } from './infraestructure/todos.repository';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), CategoriesModule],
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
})
export class TodosModule {}
