import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
import { Role } from '../domain/enums/role.enum';

  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 120 })
    name: string;
  
    @Index({ unique: true })
    @Column({ length: 160 })
    email: string; // armazenado em minúsculas
  
    @Column({ name: 'password_hash' })
    passwordHash: string;
  
    @Column({ type: 'text', default: Role.USER })
    role: Role;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  