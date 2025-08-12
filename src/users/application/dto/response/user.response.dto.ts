import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/users/domain/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({ example: 10 }) @Expose() id: number;
  @ApiProperty({ example: 'Edmilson' }) @Expose() name: string;
  @ApiProperty({ example: 'edmilson@example.com' }) @Expose() email: string;
  @ApiProperty({ enum: Role, example: Role.USER }) @Expose() role: Role;
  @ApiProperty({ example: '2025-08-11T14:35:00.000Z' })
  @Expose()
  createdAt: Date;
  @ApiProperty({ example: '2025-08-11T14:40:00.000Z' })
  @Expose()
  updatedAt: Date;
}
