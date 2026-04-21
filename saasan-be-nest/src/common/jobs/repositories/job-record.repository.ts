import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  JobRecordEntity,
  JobRecordStatus,
} from '../entities/job-record.entity';
import { Model, Types } from 'mongoose';
import { JobIdDto } from '../dtos/job-id.dto';

@Injectable()
export class JobRecordRepository {
  constructor(
    @InjectModel(JobRecordEntity.name)
    private readonly model: Model<JobRecordEntity>,
  ) {}

  async findByJobKey(jobKey: string) {
    return this.model.findOne({ jobKey });
  }

  async findById({ jobId }: JobIdDto) {
    return this.model.findById(new Types.ObjectId(jobId));
  }

  async createPending(data: {
    jobKey: string;
    topic: string;
    jobType: string;
    payload: Record<string, any>;
    maxAttempts: number;
  }) {
    return this.model.findOneAndUpdate(
      { jobKey: data.jobKey },
      {
        $setOnInsert: {
          ...data,
          attempts: 0,
          status: JobRecordStatus.PENDING,
        },
      },
      { upsert: true, new: true },
    );
  }

  async markProcessing(jobKey: string) {
    return this.model.findOneAndUpdate(
      { jobKey },
      {
        $set: {
          status: JobRecordStatus.PROCESSING,
          processingStartedAt: new Date(),
        },
        $inc: {
          attempts: 1,
        },
      },
      { new: true },
    );
  }

  async markCompleted(jobKey: string) {
    return await this.model.updateOne(
      { jobKey },
      {
        $set: {
          status: JobRecordStatus.COMPLETED,
          completedAt: new Date(),
          nextRetryAt: null,
          lastError: null,
        },
      },
    );
  }

  async scheduleRetry(jobKey: string, lastError: string, nextRetryAt: Date) {
    return await this.model.updateOne(
      { jobKey },
      {
        $set: {
          status: JobRecordStatus.RETRY_SCHEDULED,
          nextRetryAt,
          lastError,
        },
      },
    );
  }

  async markDeadLettered(jobKey: string, lastError: string) {
    return this.model.updateOne(
      { jobKey },
      {
        $set: {
          status: JobRecordStatus.DEAD_LETTERED,
          deadLetteredAt: new Date(),
          lastError,
          nextRetryAt: null,
        },
      },
    );
  }

  async markPendingForRetry({ jobId }: JobIdDto) {
    return await this.model.updateOne(
      { _id: new Types.ObjectId(jobId) },
      {
        $set: {
          status: JobRecordStatus.PENDING,
          nextRetryAt: null,
        },
      },
    );
  }

  async findDueRetries(limit = 50) {
    return await this.model
      .find({
        status: JobRecordStatus.RETRY_SCHEDULED,
        nextRetryAt: { $lte: new Date() },
      })
      .sort({ nextRetryAt: 1 })
      .limit(limit);
  }

  async findFailedJobs() {
    return await this.model
      .find({ status: JobRecordStatus.DEAD_LETTERED })
      .sort({ updatedAt: -1 });
  }
}
