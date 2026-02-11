import { Expose, Transform } from 'class-transformer';

export class PartySerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() name: string;
  @Expose() abbreviation: string;
  @Expose() ideology: string;
  @Expose() foundedIn: string;
  @Expose() logoUrl: string;
  @Expose() color: string;
  @Expose() count: number;
}
