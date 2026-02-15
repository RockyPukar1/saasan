import { Controller, UseGuards } from '@nestjs/common';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';

@UseGuards(HttpAccessTokenGuard)
@Controller('report-evidence')
export class ReportEvidenceController {}
