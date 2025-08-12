import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TodosService } from '../domain/todos.service';
import { TODO_MESSAGES } from '../domain/constants/messages';
import { TodoStatus } from '../domain/enums/todo-status.enum';
import { CreateTodoDto } from './dto/requests/create-todo.dto';
import { FilterTodoQueryDto } from './dto/requests/filter-todo.query.dto';
import { UpdateTodoDto } from './dto/requests/update-todo.dto';
import { TodoResponseDto } from './dto/response/todo.response.dto';
import { Roles } from 'src/auth/application/roles.decorator';
import { Role } from 'src/users/domain/enums/role.enum';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly service: TodosService) {}

  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiCreatedResponse({ type: TodoResponseDto })
  @ApiBadRequestResponse({ description: TODO_MESSAGES.VALIDATION_ERROR })
  @Post()
  create(@Body() dto: CreateTodoDto): Promise<TodoResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'List todos with optional filters' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: TodoResponseDto, isArray: true })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TodoStatus,
  })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @Get()
  findAll(@Query() query: FilterTodoQueryDto): Promise<TodoResponseDto[]> {
    return this.service.findAll(query);
  }

  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: TodoResponseDto })
  @ApiNotFoundResponse({ description: TODO_MESSAGES.NOT_FOUND })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoResponseDto> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Update a todo by id' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: TodoResponseDto })
  @ApiBadRequestResponse({ description: TODO_MESSAGES.VALIDATION_ERROR })
  @ApiNotFoundResponse({ description: TODO_MESSAGES.NOT_FOUND })
  @ApiParam({ name: 'id', type: Number })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete a todo by id' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiNoContentResponse({ description: TODO_MESSAGES.REMOVED })
  @ApiNotFoundResponse({ description: TODO_MESSAGES.NOT_FOUND })
  @ApiParam({ name: 'id', type: Number })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
