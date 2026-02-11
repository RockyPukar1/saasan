import { Expose, Transform } from 'class-transformer';

export class LevelSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() name: string;
  @Expose() description: string;
  @Expose() count: number;
}
