import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CaseService } from '../services/case.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { CreateCaseDto } from '../dtos/create-case.dto';
import { GetCasesDto } from '../dtos/get-cases.dto';
import { UpdateCaseDto } from '../dtos/update-case.dto';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/case')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Permissions(PERMISSIONS.cases.view)
  @Get()
  async getAll(@Query() query: GetCasesDto) {
    return await this.caseService.getAll(query);
  }

  @Permissions(PERMISSIONS.cases.view)
  @Get(':caseId')
  async getById(@Param('caseId') caseId: string) {
    return await this.caseService.getById(caseId);
  }

  @Permissions(PERMISSIONS.cases.create)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() data: CreateCaseDto) {
    return await this.caseService.create(data);
  }

  @Permissions(PERMISSIONS.cases.update)
  @Put(':caseId')
  async update(
    @Param('caseId') caseId: string,
    @Body() data: UpdateCaseDto,
  ) {
    return await this.caseService.update(caseId, data);
  }

  @Permissions(PERMISSIONS.cases.update)
  @Put(':caseId/status')
  async updateStatus(
    @Param('caseId') caseId: string,
    @Body('status') status: string,
  ) {
    return await this.caseService.updateStatus(caseId, status);
  }

  @Permissions(PERMISSIONS.cases.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':caseId')
  async delete(@Param('caseId') caseId: string) {
    await this.caseService.delete(caseId);
  }
}
