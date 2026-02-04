import { Expose, Transform, Type } from 'class-transformer';

export class ReportSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() status: string;
  @Expose() priority: string;
  @Expose() upvotesCount: number;
  @Expose() downvotesCount: number;
  @Expose() viewsCount: number;
  @Expose() referenceNumber: number;
  @Expose() tags: string[];
  @Expose() isAnonymous: boolean;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
