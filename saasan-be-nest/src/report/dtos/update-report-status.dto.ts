import { IsEnum } from "class-validator";
import { ReportStatus } from "../entities/report.entity";

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  status: string;
}