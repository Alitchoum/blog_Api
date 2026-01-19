import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UsersRepository,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //REGISTER
  async register(dto: CreateUserDto): Promise<RegisterDto> {
    const hashed = await bcrypt.hash(dto.password, 8);

    const user = await this.userRepository.createUser({
      name: dto.name,
      email: dto.email,
      password: hashed,
    });
    return this.usersService.toUserDto(user);
  }

  //LOGIN
  async signIn(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
