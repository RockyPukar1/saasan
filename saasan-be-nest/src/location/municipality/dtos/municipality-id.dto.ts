import { IsMongoId } from "class-validator";

export class MunicipalityIdDto {
  @IsMongoId()
  municipalityId: string;
}