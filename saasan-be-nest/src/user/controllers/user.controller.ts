import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.services';
import { UserIdDto } from '../dtos/user-id.dto';
import { type Request } from 'express';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';

@UseGuards(HttpAccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.userService.getAllUsers({ page, limit });
  }

  // TODO: Change email
  // TODO: Change password

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.userService.getProfile({ userId: req.user.id });
  }

  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() updateData: UpdateUserDto) {
    return this.userService.updateProfile({ userId: req.user.id }, updateData);
  }

  @Get(':userId')
  async getUserById(@Param() param: UserIdDto) {
    return this.userService.getUserById(param);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId')
  async deleteUser(@Param() param: UserIdDto) {
    await this.userService.deleteUser(param);
  }
}
