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
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { Roles } from 'src/auth/application/roles.decorator';
import { USER_MESSAGES } from '../domain/constants/messages';
import { Role } from '../domain/enums/role.enum';
import { UsersService } from '../domain/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({ description: USER_MESSAGES.EMAIL_TAKEN })
  @Post()
  create(@Body() dto: CreateUserDto, @Req() req): Promise<UserResponseDto> {
    const userRole = req.user.role;
    this.service.validateCreate(dto, userRole);
    return this.service.createRegular(dto);
  }

  @ApiOperation({ summary: 'List users' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @Get()
  findAll(): Promise<UserResponseDto[]> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: USER_MESSAGES.NOT_FOUND })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: UserResponseDto })
  @ApiConflictResponse({ description: USER_MESSAGES.EMAIL_TAKEN })
  @ApiNotFoundResponse({ description: USER_MESSAGES.NOT_FOUND })
  @ApiParam({ name: 'id', type: Number })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiNoContentResponse({ description: USER_MESSAGES.REMOVED })
  @ApiNotFoundResponse({ description: USER_MESSAGES.NOT_FOUND })
  @ApiParam({ name: 'id', type: Number })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
