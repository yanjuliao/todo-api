import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from 'src/users/domain/enums/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'Edmilson', description: 'Full name (max 120)' })
  @IsOptional() @IsString() @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 'edmilsonShow@example.com', description: 'New unique e-mail (stored lowercase)', maxLength: 160 })
  @IsOptional() @IsEmail() @MaxLength(160)
  email?: string;

  @ApiPropertyOptional({ example: 'teste124', description: 'New plain password (min 8 chars)' })
  @IsOptional() @IsString() @MinLength(8)
  password?: string;
}
