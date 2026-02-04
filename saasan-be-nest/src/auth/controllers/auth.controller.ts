import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dtos/login.dto';
import type { Request } from 'express';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: RegisterUserDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() loginData: LoginUserDto) {
    return this.authService.login(loginData);
  }

  @Post('refresh-token')
  async refreshToken() {}

  @UseGuards(HttpAccessTokenGuard)
  @Get("profile")
  async profile(@Req() req: Request) {
    return this.authService.getProfile(req.user.id);
  }
}
