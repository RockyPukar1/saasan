import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { LoginUserDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginData: LoginUserDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.authService.loginAdmin(loginData, {
      ipAddress,
      userAgent: req.headers['user-agent'],
    });
  }
}
