import { Expose, Transform } from 'class-transformer';

const asStringId = (value: any) => value?.toString?.() || value;

export class BudgetSerializer {
  @Expose()
  @Transform(({ obj }) => asStringId(obj._id || obj.id))
  id: string;

  @Expose() title: string;
  @Expose() description?: string;
  @Expose() amount: number;
  @Expose() department: string;
  @Expose() year: number;
  @Expose() status: string;
  @Expose() category?: string;

  @Expose()
  @Transform(({ obj }) => asStringId(obj.provinceId))
  provinceId?: string;

  @Expose()
  @Transform(({ obj }) => asStringId(obj.districtId))
  districtId?: string;

  @Expose()
  @Transform(({ obj }) => asStringId(obj.constituencyId))
  constituencyId?: string;

  @Expose()
  @Transform(({ obj }) => asStringId(obj.municipalityId))
  municipalityId?: string;

  @Expose()
  @Transform(({ obj }) => asStringId(obj.wardId))
  wardId?: string;

  @Expose()
  @Transform(({ obj }) => asStringId(obj.politicianId))
  politicianId?: string;

  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
