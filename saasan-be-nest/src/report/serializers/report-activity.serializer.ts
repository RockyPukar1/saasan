import { Expose, Type } from 'class-transformer';

class ReportActivityModifiedBySerializer {
  @Expose() id: string;
  @Expose() fullName: string;
}

export class ReportActivitySerializer {
  @Expose() category: string;

  @Expose()
  @Type(() => ReportActivityModifiedBySerializer)
  modifiedBy: ReportActivityModifiedBySerializer;

  @Expose() oldValue?: string;
  @Expose() newValue: string;
  @Expose() comment?: string;
  @Expose() modifiedAt: Date;
  @Expose() reportId?: string;
}
