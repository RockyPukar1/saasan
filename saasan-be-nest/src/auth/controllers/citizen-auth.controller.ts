import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { RegisterUserDto } from '../dtos/register.dto';
import { LoginUserDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('citizen/auth')
export class CitizenAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() userData: RegisterUserDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.authService.registerCitizen(userData, {
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
    return this.authService.loginCitizen(loginData, {
      ipAddress,
      userAgent: req.headers['user-agent'],
    });
  }
}
