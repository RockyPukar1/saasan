import { Expose, Transform, Type } from 'class-transformer';

export class PollOptionSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() text: string;
  @Expose() voteCount: number;
  @Expose() isVoted: boolean;
  @Expose()
  @Transform(({ obj }) => {
    const totalVotes = obj?.totalVotes ?? 0;
    if (!totalVotes) {
      return 0;
    }

    return Math.round(((obj.voteCount || 0) / totalVotes) * 100);
  })
  percentage: number;
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
  @Transform(({ obj }) => obj.createdBy?.toString?.() || obj.createdBy)
  createdBy?: string;
  @Expose()
  @Transform(({ obj }) =>
    (obj.options || []).map((option: any) => ({
      ...option,
      totalVotes: obj.totalVotes || 0,
    })),
  )
  @Type(() => PollOptionSerializer)
  options: PollOptionSerializer[];
}
