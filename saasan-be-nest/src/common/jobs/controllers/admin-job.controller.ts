import { Controller, Get, Param, Post } from '@nestjs/common';
import { JobTrackerService } from '../services/job-tracker.service';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { JobIdDto } from '../dtos/job-id.dto';

@Controller('admin/jobs')
export class AdminJobController {
  constructor(private readonly jobTracker: JobTrackerService) {}

  @Get('failed')
  async getFailedJobs() {
    const jobs = await this.jobTracker.getFailedJobs();
    return ResponseHelper.success(jobs);
  }

  @Post(':jobId/retry')
  async retryFailedJob(@Param() jobIdDto: JobIdDto) {
    await this.jobTracker.retryNow(jobIdDto);
    return ResponseHelper.success(jobIdDto, 'Job scheduled for retry');
  }
}
