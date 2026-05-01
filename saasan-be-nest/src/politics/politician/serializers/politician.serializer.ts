import { Expose, Transform, Type } from 'class-transformer';
import { SocialMediaSerializer } from './social-media.serializer';
import { ContactSerializer } from './contact-serializer';

export class SourceCategoriesDto {
  @Expose() party: string;
  @Expose() positions: string[];
  @Expose() levels: string[];
}

export class PoliticianPreferencesSerializer {
  @Expose() notifications: Record<string, boolean>;
  @Expose() appearance: Record<string, string | boolean>;
  @Expose() privacy: Record<string, string | boolean>;
  @Expose() advanced: Record<string, boolean>;
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

export class AnnouncementSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose()
  @Transform(({ obj }) => obj.politicianId?.toString?.() || obj.politicianId)
  politicianId: string;
  @Expose() title: string;
  @Expose() content: string;
  @Expose() type: string;
  @Expose() priority: string;
  @Expose() isPublic: boolean;
  @Expose() scheduledAt?: Date;
  @Expose() publishedAt?: Date;
  @Expose()
  @Transform(({ obj }) => obj.createdBy?.toString?.() || obj.createdBy)
  createdBy: string;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
export class PoliticianSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose()
  @Transform(({ obj }) => obj.userId?.toString?.() || obj.userId)
  userId?: string;
  @Expose() fullName: string;
  @Expose() age?: number;
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
  @Expose() isActive?: boolean;
  @Expose() profession: string;
  @Expose() joinedDate?: Date;
  @Expose() photoUrl?: string;
  @Expose() rating: number;
  @Expose() totalReports: number;
  @Expose() totalVotes: number;
  @Expose() verifiedReports: number;
  @Expose()
  @Transform(({ obj }) => obj.partyId?.toString?.() || obj.partyId)
  partyId?: string;
  @Expose()
  @Transform(({ obj }) => obj.constituencyId?.toString?.() || obj.constituencyId)
  constituencyId?: string;
  @Expose() termStartDate?: Date;
  @Expose() termEndDate?: Date;
  @Expose() experiences?: Array<{
    category: string;
    title: string;
    company: string;
    startDate: Date;
    endDate: Date;
  }>;
  @Expose() hasAccount?: boolean;
  @Expose() accountCreatedAt?: Date;
  @Expose()
  @Type(() => SourceCategoriesDto)
  sourceCategories: SourceCategoriesDto;
  @Expose()
  @Type(() => PoliticianPreferencesSerializer)
  preferences?: PoliticianPreferencesSerializer;

  @Expose()
  @Type(() => PromiseSerializer)
  promises?: PromiseSerializer[];
  @Expose()
  @Type(() => AchievementSerializer)
  achievements?: AchievementSerializer[];

  @Expose() createdAt: string;
  @Expose() updatedAt: string;
}
