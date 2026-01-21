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
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/protect.decorator';
import { ConnectedUser } from './connected-user.decorator';
import * as userSchema from './user.schema';
import { UserMapper } from './user-mapper';

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
  getProfile(@ConnectedUser() user: userSchema.UserDocument): UserDto {
    return this.userMapper.toUserDto(user);
  }

  //GET ALL USERS
  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: UserDto, description: 'Get all users successfully' })
  findAllUser(): Promise<UserDto[]> {
    return this.usersService.findAllUser();
  }

  //GET USER BY ID
  @Protect()
  @Get(':userId')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserDto })
  findUserById(@Param('userId') userId: string) {
    return this.usersService.findUserById(userId);
  }

  //UPDATE USER BY ID
  @Protect()
  @Patch(':userId')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserDto })
  updateUser(
    @Param('userId') userId: string,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateData);
  }

  //DELETE USER BY ID
  @Protect()
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user by id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAcceptedResponse()
  deleteUser(@Param('userId') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
