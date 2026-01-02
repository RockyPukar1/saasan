import { Expose, Transform } from 'class-transformer';

export class PositionSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() count: number;
  @Expose() abbreviation: string;
}
