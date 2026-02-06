import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { GetUserDto } from './dto/response/get-user.dto';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/decorators/protect.decorator';
import { ConnectedUser } from './connected-user.decorator';
import * as userSchema from './user.schema';
import { UserMapper } from './user.mapper';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userMapper: UserMapper,
  ) {}

  //GET USER PROFIL (TOKEN)
  @Protect()
  @Get('profile')
  @ApiOperation({ summary: 'Load protected profile' })
  getProfile(@ConnectedUser() user: userSchema.UserDocument): GetUserDto {
    return this.userMapper.toUserDto(user);
  }

  //GET ALL USERS
  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    type: GetUserDto,
    description: 'Get all users successfully',
  })
  findAllUser(): Promise<GetUserDto[]> {
    return this.usersService.findAllUser();
  }

  //GET USER BY ID
  @Protect()
  @Get(':userId')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: GetUserDto })
  findUserById(@Param('userId') userId: string) {
    return this.usersService.findUserById(userId);
  }

  //UPDATE USER BY ID
  @Protect()
  @Patch(':userId')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: GetUserDto })
  updateUser(
    @Param('userId') userId: string,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateData);
  }

  //DELETE USER BY ID
  @Protect()
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user(s) by id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAcceptedResponse()
  deleteUser(@Param('userId') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
