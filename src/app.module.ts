import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/infraestructure/category.entity';
import { Todo } from './todos/infraestructure/todo.entity';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/infraestructure/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Category, Todo, User],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CategoriesModule,
    TodosModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
