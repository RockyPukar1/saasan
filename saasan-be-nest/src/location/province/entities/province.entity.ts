import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: ProvinceEntity.collection })
export class ProvinceEntity {
  static readonly collection = 'provinces';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Number, required: true, unique: true })
  provinceNumber: number;

  @Prop({ type: String, required: true })
  capital: string;
}

export const ProvinceEntitySchema =
  SchemaFactory.createForClass(ProvinceEntity);
export type ProvinceEntityDocument = Document & ProvinceEntity;
