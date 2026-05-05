import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { BudgetService } from '../services/budget.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constants';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.ADMIN)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Permissions(PERMISSIONS.budget.view)
  @Get()
  async getAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.budgetService.getAll(paginationQuery);
  }
}
