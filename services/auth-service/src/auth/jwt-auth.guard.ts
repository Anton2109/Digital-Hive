import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.debug(`JwtAuthGuard - Error: ${err}`);
    this.logger.debug(`JwtAuthGuard - User: ${user}`);
    this.logger.debug(`JwtAuthGuard - Info: ${JSON.stringify(info)}`);

    if (err || !user) {
      this.logger.error(`JwtAuthGuard - Authentication failed: ${err?.message || 'No user found'}`);
      throw new UnauthorizedException(err?.message || 'No user found');
    }

    return user;
  }
} 