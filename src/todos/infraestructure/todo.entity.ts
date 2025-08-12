import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/infraestructure/category.entity';
import { TodoStatus } from '../domain/enums/todo-status.enum';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() title: string;

  @Column({ nullable: true }) description?: string;

  @Column({ type: 'text', default: TodoStatus.PENDING })
  status: TodoStatus;

  @ManyToOne(() => Category, (category) => category.todos, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: false })
  categoryId: number;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
