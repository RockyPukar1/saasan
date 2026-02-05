import { IsMongoId, IsString } from "class-validator";

export class ProvinceIdDto {
  @IsMongoId()
  provinceId: string
}