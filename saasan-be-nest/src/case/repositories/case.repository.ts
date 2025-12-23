import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CaseEntity, CaseEntityDocument } from '../entities/case.entity';

@Injectable()
export class CaseRepository {
  constructor(
    @InjectModel(CaseEntity.name)
    private readonly model: Model<CaseEntityDocument>,
  ) {}
}
