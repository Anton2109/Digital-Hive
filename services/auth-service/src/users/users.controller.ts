import { Controller, Get, Post, Body, UseGuards, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() req: Request): Promise<User> {
    // Получаем email из токена
    const currentEmail = (req.user as any).email;
    return this.usersService.updateProfile(updateProfileDto, currentEmail);
  }
}
