import { Category } from '../infraestructure/category.entity';
import { CategorySummaryDto } from './dto/response/category-summary.dto';
import { CategoryResponseDto } from './dto/response/category.response.dto';


export const toCategoryResponse = (c: Category): CategoryResponseDto => ({
  id: c.id,
  name: c.name,
  description: c.description ?? '',
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

export const toCategorySummary = (c: Category): CategorySummaryDto => ({
  id: c.id,
  name: c.name,
});
