import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dtos/login.dto';
import type { Request } from 'express';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { SessionIdDto } from '../dtos/session-id.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() userData: RegisterUserDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.authService.register(userData, undefined, {
      ipAddress,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('login')
  async login(
    @Body() loginData: LoginUserDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.authService.login(loginData, {
      ipAddress,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.authService.refreshToken(refreshTokenDto, {
      ipAddress,
      userAgent: req.headers['user-agent'],
    });
  }

  @UseGuards(HttpAccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() req: Request) {
    await this.authService.logoutCurrentSession({
      sessionId: req.user.sessionId!,
    });
  }

  @UseGuards(HttpAccessTokenGuard)
  @Get('sessions')
  async getMySessions(@Req() req: Request) {
    return await this.authService.getMySessions({
      userId: req.user.id,
    });
  }

  @UseGuards(HttpAccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('sessions/:sessionId')
  async revokeMySession(
    @Req() req: Request,
    @Param() sessionIdDto: SessionIdDto,
  ) {
    await this.authService.revokeMySession(
      { userId: req.user.id },
      sessionIdDto,
    );
  }

  @UseGuards(HttpAccessTokenGuard)
  @Post('sessions/revoke-all')
  async revokeAllMySessions(@Req() req: Request) {
    return this.authService.revokeAllMySessions(
      { userId: req.user.id },
      { sessionId: req.user.sessionId! },
    );
  }
}
