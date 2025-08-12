import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './application/users.controller';
import { UsersService } from './domain/users.service';
import { User } from './infraestructure/user.entity';
import { UsersRepository } from './infraestructure/users.repository';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
