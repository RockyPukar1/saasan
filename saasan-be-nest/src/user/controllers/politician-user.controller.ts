import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { UserService } from '../services/user.services';
import type { Request } from 'express';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { ChangeCurrentPasswordDto } from '../dtos/change-current-password.dto';
import { DeleteAccountDto } from '../dtos/delete-account.dto';
import { UpdatePoliticianPreferencesDto } from '../dtos/update-politician-preferences.dto';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.POLITICIAN)
@Controller('politician/user')
export class PoliticianUserController {
  constructor(private readonly userService: UserService) {}

  @Permissions(PERMISSIONS.profile.view)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.userService.getProfile({ userId: req.user.id });
  }

  @Permissions(PERMISSIONS.profile.update)
  @Put('profile')
  async updateProfile(@Req() req: Request, @Body() updateData: UpdateUserDto) {
    return this.userService.updateProfile({ userId: req.user.id }, updateData);
  }

  @Permissions(PERMISSIONS.profile.update)
  @Put('settings/preferences')
  async updatePreferences(
    @Req() req: Request,
    @Body() preferences: UpdatePoliticianPreferencesDto,
  ) {
    return this.userService.updatePoliticianPreferences(
      { userId: req.user.id },
      preferences,
    );
  }

  @Permissions(PERMISSIONS.profile.update)
  @Post('settings/password')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangeCurrentPasswordDto,
  ) {
    return this.userService.changeMyPassword(
      { userId: req.user.id },
      req.user.sessionId,
      changePasswordDto,
    );
  }

  @Permissions(PERMISSIONS.profile.view)
  @Get('settings/export')
  async exportMyData(@Req() req: Request) {
    return this.userService.exportMyData({ userId: req.user.id });
  }

  @Permissions(PERMISSIONS.profile.update)
  @HttpCode(HttpStatus.OK)
  @Delete('settings/account')
  async deleteMyAccount(
    @Req() req: Request,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    return this.userService.deleteMyAccount(
      { userId: req.user.id },
      deleteAccountDto,
    );
  }
}
