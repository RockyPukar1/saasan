import { Expose, Transform, Type } from 'class-transformer';

export class SourceCategoriesDto {
  @Expose() party: string;
  @Expose() positions: string[];
  @Expose() levels: string[];
}
export class PoliticianSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() fullName: string;
  @Expose() experienceYears: string;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
  @Expose() isIndependent: boolean;
  @Expose() rating: number;
  @Expose() totalReports: number;
  @Expose() verifiedReports: number;
  @Expose()
  @Type(() => SourceCategoriesDto)
  sourceCategories: SourceCategoriesDto;
}
