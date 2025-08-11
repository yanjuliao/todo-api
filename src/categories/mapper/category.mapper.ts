import { Category } from '../entities/category.entity';
import { CategoryResponseDto } from '../dto/response/category.response.dto';
import { CategorySummaryDto } from '../dto/response/category-summary.dto';

export const toCategoryResponse = (c: Category): CategoryResponseDto => ({
  id: c.id,
  name: c.name,
  description: c.description ?? "",
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

export const toCategorySummary = (c: Category): CategorySummaryDto => ({
  id: c.id,
  name: c.name,
});
