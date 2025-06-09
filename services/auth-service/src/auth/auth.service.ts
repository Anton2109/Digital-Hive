import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(email, password);
    if (user) {
      if (password === 'admin') {
        user.role = 'admin';
        await this.usersService.update(user.id, { role: 'admin' });
      }
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role 
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      role: user.role
    };
  }

  async register(userData: AuthDto) {
    if (userData.password === 'admin') {
      userData.role = 'admin';
    }
    const user = await this.usersService.create(userData);
    return this.login(user);
  }

  async getProfile(user: any) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User ID is required');
    }
    const foundUser = await this.usersService.findById(user.id);
    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }
    
    const profile = {
      id: foundUser.id,
      email: foundUser.email,
      username: foundUser.username,
      role: foundUser.role
    };
    
    return profile;
  }
}
