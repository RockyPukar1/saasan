import { Expose, Transform } from 'class-transformer';

const toNumber = (value: any) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (value && typeof value === 'object') {
    if (typeof value.$numberDecimal === 'string') {
      const parsed = Number(value.$numberDecimal);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    const parsed = Number(value.toString?.());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

export class CaseSerializer {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString?.() || obj.id)
  id: string;

  @Expose() title: string;
  @Expose() description: string;
  @Expose() status: string;
  @Expose() priority: string;
  @Expose()
  @Transform(({ obj }) => toNumber(obj.amountInvolved))
  amountInvolved: number;
  @Expose() dateOccurred: Date;
  @Expose() referenceNumber: string;
  @Expose() provinceId?: string;
  @Expose() districtId?: string;
  @Expose() constituencyId?: string;
  @Expose() municipalityId?: string;
  @Expose() wardId?: string;
  @Expose() locationDescription?: string;
  @Expose() peopleAffectedCount: number;
  @Expose() upvotesCount?: number;
  @Expose() downvotesCount?: number;
  @Expose() viewsCount?: number;
  @Expose() sharesCount?: number;
  @Expose() isPublic?: boolean;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
