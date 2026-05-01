import { Expose, Type } from 'class-transformer';
import { PoliticianSerializer } from 'src/politics/politician/serializers/politician.serializer';

export class ReportApprovalSuggestionsSerializer {
  @Expose() reportId: string;
  @Expose() hasJurisdictionPolitician: boolean;

  @Expose()
  @Type(() => PoliticianSerializer)
  suggestedPoliticians: PoliticianSerializer[];
}
