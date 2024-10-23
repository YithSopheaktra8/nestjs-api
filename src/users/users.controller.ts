/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamDto } from './dtos/get-users-params.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UserService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id?')
  @ApiOperation({ 
    summary: 'Get all users or a single user', 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false,
    type: Number,
    description: 'Limit the number of users returned',
    example: 10
  })
  @ApiQuery({ 
    name: 'page', 
    required: false,
    type: Number,
    description: 'The page number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The users were successfully retrieved',
  })
  public getUser(
    @Param() getUserParamDto: GetUserParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(getUserParamDto);
    console.log(limit);
    console.log(page);
    return this.userService.findAll(getUserParamDto, limit, page);
  }

  
  @Post()
  @Auth(AuthType.Bearer)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/create-many')
  public createManyUsers(@Body() createUserDto: CreateManyUsersDto) {
    return this.userService.createMany(createUserDto);
  }

  @Patch()
  public updateUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
