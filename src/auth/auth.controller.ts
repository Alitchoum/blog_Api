import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { Protect } from './protect.decorator';
import { ConnectedUser } from '../users/connected-user.decorator';
import type { Payload } from './jwt-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  //REGISTER
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  //LOGIN
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async signIn(@Body() body: LoginDto) {
    return this.authService.signIn(body.email, body.password);
  }
  //
  //   //GET USER PROFIL (TOKEN)
  //   @Protect()
  //   @Get('profile')
  //   @ApiOperation({ summary: 'Load protected profile' })
  //   async getProfile(@ConnectedUser() payload: Payload): Promise<UserDto> {
  //     return this.usersService.findUserById(payload.sub);
  //   }
}
