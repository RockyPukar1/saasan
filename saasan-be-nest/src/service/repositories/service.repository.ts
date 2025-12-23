import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ServiceEntity,
  ServiceEntityDocument,
} from '../entities/service.entity';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectModel(ServiceEntity.name)
    private readonly model: Model<ServiceEntityDocument>,
  ) {}

  async getLiveServices() {
    return await this.model.find().sort({ lastUpdated: -1 });
  }
}
