import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EvidenceService } from '../services/evidence.service';
import { ReportIdDto } from '../dtos/report-id.dto';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { type Request } from 'express';

@UseGuards(HttpAccessTokenGuard)
@Controller('report-evidence')
export class ReportEvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Get(':reportId')
  async getEvidences(@Param() param: ReportIdDto) {
    return await this.evidenceService.getEvidencesByReport(param);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FilesInterceptor('files'))
  @Post(':reportId')
  async uploadEvidence(
    @Param() param: ReportIdDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10 MB
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png|gif|pdf|doc|docx|mp3|wav|m4a)$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return await this.evidenceService.uploadEvidence(param, files);
  }

  @Put(':reportId')
  async updateEvidence(
    @Param() param: ReportIdDto,
    @Body()
    updateData: {
      evidenceToAdd?: Express.Multer.File[];
      evidenceToRemove?: string[]; // Array of evidence IDs to remove
    },
  ) {
    return await this.evidenceService.updateEvidence(param, updateData);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':reportId/:evidenceId')
  async deleteEvidence(
    @Param('evidenceId') evidenceId: string,
    @Param() reportIdDto: ReportIdDto,
    @Body('cloudinaryPublicId') cloudinaryPublicId: string,
  ) {
    return await this.evidenceService.removeEvidence(
      reportIdDto,
      { evidenceId },
      cloudinaryPublicId,
    );
  }
}
