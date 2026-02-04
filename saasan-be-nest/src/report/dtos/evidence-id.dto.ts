import { IsMongoId } from "class-validator";

export class EvidenceIdDto {
  @IsMongoId()
  evidenceId: string
}