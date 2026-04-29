import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: BudgetEntity.collection })
export class BudgetEntity {
  static readonly collection = 'budgets';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true })
  department: string;

  @Prop({ type: Number, required: true })
  year: number;

  @Prop({
    type: String,
    enum: ['approved', 'pending', 'rejected', 'in_progress'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'ProvinceEntity' })
  provinceId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'DistrictEntity' })
  districtId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ConstituencyEntity' })
  constituencyId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MunicipalityEntity' })
  municipalityId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'WardEntity' })
  wardId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PoliticianEntity' })
  politicianId?: Types.ObjectId;

  @Prop({ type: String })
  category?: string;

  @Prop({ type: Boolean, default: false })
  isSeeded?: boolean;
}

export const BudgetEntitySchema = SchemaFactory.createForClass(BudgetEntity);
export type BudgetEntityDocument = Document & BudgetEntity;
