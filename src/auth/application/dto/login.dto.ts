import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com' }) @IsEmail() email: string;
  @ApiProperty({ example: 'P@ssw0rd!' }) @IsString() @MinLength(8) password: string;
}