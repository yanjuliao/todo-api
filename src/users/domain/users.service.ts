import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { toDto } from 'src/common/to-dto';
import { USER_MESSAGES } from './constants/messages';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../application/dto/requests/create-user.dto';
import { UpdateUserDto } from '../application/dto/requests/update-user.dto';
import { UserResponseDto } from '../application/dto/response/user.response.dto';
import { toUserResponse } from '../application/user.mapper';
import { UsersRepository } from '../infraestructure/users.repository';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async createRegular(data: CreateUserDto): Promise<UserResponseDto> {
    const email = data.email.trim().toLowerCase();
    const stored = await this.repo.findByEmail(email);
    if (stored) throw new ConflictException(USER_MESSAGES.EMAIL_TAKEN);

    return this.create(data);
  }

  async createAdmin(): Promise<UserResponseDto> {
    const adminDto = this.buildAdminUserDto();
    const stored = await this.repo.findByEmail(adminDto.email.toLowerCase());
    if (stored) return toDto(UserResponseDto, toUserResponse(stored));

    return this.create(adminDto);
  }

  private async create(data: CreateUserDto): Promise<UserResponseDto> {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const role = data.role ?? Role.USER;

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const entity = this.repo.create({ name, email, role, passwordHash });
    const saved = await this.repo.save(entity);

    return toDto(UserResponseDto, toUserResponse(saved));
  }

  validateCreate(dto: CreateUserDto, role: Role): void {
    if (role !== Role.ADMIN && dto.role === Role.ADMIN) {
      throw new ForbiddenException(USER_MESSAGES.CANNOT_CREATE_ADMIN_MESSAGE);
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const list = await this.repo.findAll();
    return list.map((u) => toDto(UserResponseDto, toUserResponse(u)));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    return toDto(UserResponseDto, toUserResponse(found));
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(USER_MESSAGES.NOT_FOUND);

    if (dto.name !== undefined) found.name = dto.name.trim();

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();
      if (await this.repo.existsByEmail(email, id)) {
        throw new ConflictException(USER_MESSAGES.EMAIL_TAKEN);
      }
      found.email = email;
    }

    if (dto.password !== undefined) {
      found.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    const saved = await this.repo.save(found);
    return toDto(UserResponseDto, toUserResponse(saved));
  }

  async remove(id: number): Promise<void> {
    const found = await this.repo.findOneById(id);
    if (!found) throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    await this.repo.remove(found);
  }

  buildAdminUserDto(): CreateUserDto {
    return {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      role: Role.ADMIN,
    };
  }
}
