import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
