import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'isPodViPodVerta',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT Strategy - Validating payload: ${JSON.stringify(payload)}`);
    try {
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        this.logger.error(`User not found with ID: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }
      this.logger.debug(`JWT Strategy - Found user: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
} 