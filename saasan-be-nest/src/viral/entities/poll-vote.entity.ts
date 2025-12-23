import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: PollVoteEntity.collection })
export class PollVoteEntity {
  static readonly collection = 'poll-votes';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'PollEntity' })
  pollId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PollOptionEntity' })
  optionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
  userId: Types.ObjectId;
}

export const PollVoteEntitySchema =
  SchemaFactory.createForClass(PollVoteEntity);
export type PollVoteEntityDocument = Document & PollVoteEntity;
