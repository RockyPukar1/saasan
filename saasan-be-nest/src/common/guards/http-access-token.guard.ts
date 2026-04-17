import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthSessionRepository } from 'src/auth/repositories/auth-session.repository';

@Injectable()
export class HttpAccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authSessionRepo: AuthSessionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SAASAN_JWT_SECRET,
      });

      if (payload?.type !== 'access') throw new UnauthorizedException();

      if (!payload?.sessionId) throw new UnauthorizedException();

      const session = await this.authSessionRepo.findActiveSessionById({
        sessionId: payload.sessionId,
      });

      if (!session) throw new UnauthorizedException();

      if (new Date(session.refreshExpiresAt).getTime() < Date.now())
        throw new UnauthorizedException();

      request['user'] = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        sessionId: payload.sessionId,
      };

      await this.authSessionRepo.updateLastUsed(payload.sessionId);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }
}
