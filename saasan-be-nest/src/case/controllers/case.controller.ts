import { Controller, UseGuards } from '@nestjs/common';
import { CaseService } from '../services/case.service';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';

@UseGuards(HttpAccessTokenGuard)
@Controller('case')
export class CaseController {
  constructor(private readonly pollService: CaseService) {}
}
