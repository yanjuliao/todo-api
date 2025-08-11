import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the category' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Work', description: 'Name of the category' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Tasks related to work and office', description: 'Description of the category' })
  @Expose()
  description?: string;

  @ApiProperty({ example: '2025-08-11T14:35:00.000Z', description: 'Date when the category was created' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2025-08-11T14:40:00.000Z', description: 'Date when the category was last updated' })
  @Expose()
  updatedAt: Date;
}
