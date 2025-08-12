import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from 'src/users/domain/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Edmilson', description: 'Full name (max 120)', maxLength: 120 })
  @IsString() @IsNotEmpty() @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'edmilson@example.com', description: 'Unique e-mail (stored lowercase)', maxLength: 160 })
  @IsEmail() @MaxLength(160)
  email: string;

  @ApiProperty({ example: 'teste123', description: 'Plain password (min 8 chars, will be hashed)' })
  @IsString() @MinLength(8)
  password: string;

  @ApiProperty({ enum: Role, required: false, example: Role.USER, description: 'User role (default USER)' })
  @IsEnum(Role) @IsOptional()
  role?: Role;
}
