import { IsMongoId } from "class-validator";

export class ReportIdDto {
  @IsMongoId()
  reportId: string;
}