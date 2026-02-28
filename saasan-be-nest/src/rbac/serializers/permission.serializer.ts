import { Expose, Transform } from 'class-transformer';

export class PermissionSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() name: string;
  @Expose() description: string;
  @Expose() resource: string;
  @Expose() module: string;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
