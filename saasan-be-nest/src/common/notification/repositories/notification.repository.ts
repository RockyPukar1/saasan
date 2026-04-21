import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationEntity } from '../entities/notification.entity';
import { Model } from 'mongoose';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(NotificationEntity.name)
    private readonly model: Model<NotificationEntity>,
  ) {}

  async create(data: Partial<NotificationEntity>) {
    return this.model.findOneAndUpdate(
      { jobKey: data.jobKey },
      { $setOnInsert: data },
      { upsert: true, new: true },
    );
  }
}
