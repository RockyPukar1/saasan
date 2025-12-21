import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../services/user.services';
import { UserIdDto } from '../dtos/user-id.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  profile() {}

  @Get(':userId')
  async getUserById(@Param() param: UserIdDto) {
    return this.userService.getUserById(param);
  }
}
