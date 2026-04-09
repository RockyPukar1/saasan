import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PoliticianAccountEntity,
  PoliticianAccountEntityDocument,
} from '../entities/politician-account.entity';
import { Model } from 'mongoose';
import { CreatePoliticianAccountDto } from '../dtos/create-politician-account.dto';

@Injectable()
export class PoliticianAccountRepository {
  constructor(
    @InjectModel(PoliticianAccountEntity.name)
    private readonly model: Model<PoliticianAccountEntityDocument>,
  ) {}

  async create(politicianAccountData: CreatePoliticianAccountDto) {
    return await this.model.create(politicianAccountData);
  }
}
