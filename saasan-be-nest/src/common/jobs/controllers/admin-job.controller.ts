import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JobTrackerService } from '../services/job-tracker.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { JobIdDto } from '../dtos/job-id.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { JobRecordSerializer } from '../serializers/job-record.serializer';

@UseGuards(HttpAccessTokenGuard, RoleGuard, PermissionGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/jobs')
export class AdminJobController {
  constructor(private readonly jobTracker: JobTrackerService) {}

  @Permissions(PERMISSIONS.jobs.view)
  @Get('failed')
  async getFailedJobs() {
    const jobs = await this.jobTracker.getFailedJobs();
    return ResponseHelper.response(
      JobRecordSerializer,
      jobs,
      'Failed jobs fetched successfully',
    );
  }

  @Permissions(PERMISSIONS.jobs.retry)
  @Post(':jobId/retry')
  async retryFailedJob(@Param() jobIdDto: JobIdDto) {
    await this.jobTracker.retryNow(jobIdDto);
    return ResponseHelper.success(jobIdDto, 'Job scheduled for retry');
  }
}
