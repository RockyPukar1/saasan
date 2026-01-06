import { Expose, Transform } from 'class-transformer';

export class PositionSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose({ name: 'title' }) name: string;
  @Expose() description: string;
  @Expose() count: number;
  @Expose() abbreviation: string;
}
