import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ElectionCandidateEntity } from '@/candidate/entities/election-candidate.entity';
import { UserEntity } from '@/user/entities/user.entity';
import { VotingSessionEntity } from '@/vote/voting-session/entities/voting-session.entity';

@Schema({ timestamps: true, collection: UserVoteEntity.collection })
export class UserVoteEntity {
  static readonly collection = 'user-votes';
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: VotingSessionEntity.name })
  votingSessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: ElectionCandidateEntity.name })
  candidateId: Types.ObjectId;
}

export const UserVoteEntitySchema =
  SchemaFactory.createForClass(UserVoteEntity);
export type UserVoteEntityDocument = Document & UserVoteEntity;
