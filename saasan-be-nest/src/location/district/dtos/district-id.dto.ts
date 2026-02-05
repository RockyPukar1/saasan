import { IsMongoId } from "class-validator";

export class DistrictIdDto {
  @IsMongoId()
  districtId: string;
}