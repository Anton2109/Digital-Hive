import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/auth.dto';
import { User } from './auth.entity';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() createAuthDto: CreateAuthDto): Promise<User> {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  async login(@Body() authDto: CreateAuthDto) {
    const user = await this.authService.validateUser(
      authDto.email,
      authDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Неверные логин или пароль');
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.authService.findAll();
  }
}
