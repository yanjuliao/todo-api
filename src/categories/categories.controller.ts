import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { CategoryResponseDto } from './dto/response/category.response.dto';
import { CATEGORY_MESSAGES } from './constants/messages';
import { Public } from 'src/auth/public.decorator';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @ApiOperation({ summary: 'Create category' })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  @ApiBadRequestResponse({ description: CATEGORY_MESSAGES.VALIDATION_ERROR })
  @Post()
  create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'List categories' })
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  @Public()
  @Get()
  findAll(): Promise<CategoryResponseDto[]> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: CATEGORY_MESSAGES.NOT_FOUND })
  @ApiParam({ name: 'id', type: Number })
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: CATEGORY_MESSAGES.NOT_FOUND })
  @ApiParam({ name: 'id', type: Number })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiNoContentResponse({ description: CATEGORY_MESSAGES.REMOVED })
  @ApiNotFoundResponse({ description: CATEGORY_MESSAGES.NOT_FOUND })
  @ApiBadRequestResponse({ description: CATEGORY_MESSAGES.HAS_TODOS })
  @ApiParam({ name: 'id', type: Number })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
