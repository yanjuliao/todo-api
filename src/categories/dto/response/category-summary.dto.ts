import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategorySummaryDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the category' })
  @Expose()
  id: number;
  
  @ApiProperty({ example: 'Work', description: 'Name of the category' })
  @Expose()
  name: string;
}
