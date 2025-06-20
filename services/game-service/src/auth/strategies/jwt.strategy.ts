import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'isPodViPodVerta',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT Strategy - Validating payload: ${JSON.stringify(payload)}`);
    return { id: payload.sub, email: payload.email };
  }
} 