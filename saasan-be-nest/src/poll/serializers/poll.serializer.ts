import { Expose, Transform, Type } from 'class-transformer';

export class PollOptionSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() text: string;
  @Expose() voteCount: number;
  @Expose() isVoted: boolean;
}

export class PollSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() title: string;
  @Expose() category: string;
  @Expose() createdAt: string;
  @Expose() description: string;
  @Expose() endDate: string;
  @Expose() requiresVerification: boolean;
  @Expose() startDate: string;
  @Expose() status: string;
  @Expose() type: string;
  @Expose() updatedAt: string;
  @Expose() totalVotes: number;
  @Expose()
  @Type(() => PollOptionSerializer)
  options: PollOptionSerializer[];
}
