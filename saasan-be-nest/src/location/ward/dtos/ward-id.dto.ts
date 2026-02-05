import { IsMongoId } from "class-validator";

export class WardIdDto {
  @IsMongoId()
  wardId: string;
}