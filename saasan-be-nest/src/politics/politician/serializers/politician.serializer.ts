import { Expose, Transform, Type } from 'class-transformer';
import { SocialMediaSerializer } from './social-media.serializer';
import { ContactSerializer } from './contact-serializer';

export class SourceCategoriesDto {
  @Expose() party: string;
  @Expose() positions: string[];
  @Expose() levels: string[];
}

export class PromiseSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() status: string;
  @Expose() dueDate: Date;
  @Expose() progress: number;
}
export class AchievementSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() category: string;
  @Expose() date: Date;
}
export class PoliticianSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() fullName: string;
  @Expose() biography: string;
  @Expose()
  @Type(() => ContactSerializer)
  contact: ContactSerializer;
  @Expose()
  @Type(() => SocialMediaSerializer)
  socialMedia: SocialMediaSerializer;
  @Expose() education: string;
  @Expose() experienceYears: number;
  @Expose() isIndependent: boolean;
  @Expose() profession: string;
  @Expose() rating: number;
  @Expose() totalReports: number;
  @Expose() totalVotes: number;
  @Expose() verifiedReports: number;
  @Expose()
  @Type(() => SourceCategoriesDto)
  sourceCategories: SourceCategoriesDto;

  @Expose()
  @Type(() => PromiseSerializer)
  promises?: PromiseSerializer[];
  @Expose()
  @Type(() => AchievementSerializer)
  achievements?: AchievementSerializer[];

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
