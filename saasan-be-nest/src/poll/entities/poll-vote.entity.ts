import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: PollVoteEntity.collection })
export class PollVoteEntity {
  static readonly collection = 'poll-votes';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'PollEntity', required: true })
  pollId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PollOptionEntity', required: true })
  optionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
  userId: Types.ObjectId;
}

export const PollVoteEntitySchema =
  SchemaFactory.createForClass(PollVoteEntity);

PollVoteEntitySchema.index(
  { userId: 1, pollId: 1 },
  {
    unique: true,
  },
);
export type PollVoteEntityDocument = Document & PollVoteEntity;
