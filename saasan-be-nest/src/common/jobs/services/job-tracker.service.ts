import { Injectable } from '@nestjs/common';
import { JobRecordRepository } from '../repositories/job-record.repository';
import { JobRecordStatus } from '../entities/job-record.entity';
import { JobIdDto } from '../dtos/job-id.dto';

@Injectable()
export class JobTrackerService {
  constructor(private readonly jobRepo: JobRecordRepository) {}

  async registerPending(data: {
    jobKey: string;
    topic: string;
    jobType: string;
    payload: Record<string, any>;
    maxAttempts: number;
  }) {
    return await this.jobRepo.createPending(data);
  }

  async beginProcessing(jobKey: string) {
    const existing = await this.jobRepo.findByJobKey(jobKey);

    if (!existing) {
      return false;
    }

    if (existing.status === JobRecordStatus.COMPLETED) {
      return false;
    }

    if (existing.status === JobRecordStatus.PROCESSING) {
      return false;
    }

    await this.jobRepo.markProcessing(jobKey);
    return true;
  }

  async markCompleted(jobKey: string) {
    await this.jobRepo.markCompleted(jobKey);
  }

  async scheduleRetry(jobKey: string, lastError: string, attempt: number) {
    const delayMs = this.getRetryDelay(attempt);
    const nextRetryAt = new Date(Date.now() + delayMs);

    await this.jobRepo.scheduleRetry(jobKey, lastError, nextRetryAt);
  }

  async markDeadLettered(jobKey: string, lastError: string) {
    await this.jobRepo.markDeadLettered(jobKey, lastError);
  }

  async getDueRetries() {
    return this.jobRepo.findDueRetries();
  }

  async markPendingForRetry(jobIdDto: JobIdDto) {
    await this.jobRepo.markPendingForRetry(jobIdDto);
  }

  async getFailedJobs() {
    return this.jobRepo.findFailedJobs();
  }

  async retryNow(jobIdDto: JobIdDto) {
    await this.jobRepo.markPendingForRetry(jobIdDto);
  }

  private getRetryDelay(attempt: number) {
    const delays = [60_000, 5 * 60_000, 15 * 60_000];
    return delays[Math.min(attempt - 1, delays.length - 1)];
  }
}
