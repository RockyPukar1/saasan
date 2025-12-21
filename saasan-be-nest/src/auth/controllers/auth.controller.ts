import { Body, Controller, Post, Req } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register.dto';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dtos/login.dto';

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
}
