import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EvidenceService } from '../services/evidence.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { ReportIdDto } from '../dtos/report-id.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('report-evidence')
export class ReportEvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':reportId/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvidence(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10 MB
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png|gif|pdf|doc|docx)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param() reportIdDto: ReportIdDto,
  ) {
    return this.evidenceService.uploadEvidence(reportIdDto, file);
  }
}
